/*
 * Module dependencies.
 */

const db = require('../models');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const path = require('path');
const nodeMailer = require('../core/mail');
const {server, steamConfig, jwt, dirname} = require('../config');
const {makeSalt, encryptPassword, randomString, authenticate} = require('../utils');
const coroutine = require('bluebird').coroutine;
const {logout, login, isAuth} = require('../controllers/abstractUser');
const openDota = require('../api/opendota');
const shortid = require('shortid');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const steamApi = require('../api/steam');
const siteUrl = `${server.host}:${server.port === 80 ? '' : server.port}`;
const MAX_USER_TAGS = 20;

/**
 * Expose User  API controller
 */

module.exports.getToken = coroutine(function*(req, res) {
  let token = JWT.sign({user_id: req.user ? req.user.id : null}, jwt.secret);

  res.send({token})
});

module.exports.getNotificationsCount = coroutine(function*(req, res) {
  let notifyCount = yield db.UserNotifications.count({where: {user_id: req.user.id, checked: 0}});

  res.send({notifyCount})
});


module.exports.getUserByFilter = coroutine(function*(req, res) {
  let {tag: id} = req.query;
  if (id && id.length && id.length > MAX_USER_TAGS) {
    return res.send({error: 'No or to much tags'});
  }

  const users = yield db.User.findAll({
    include: [
      {
        model: db.Tags,
        where: {
          id
        },
        through: {
          attributes: []
        },
        as: 'tags',
        attributes: ['id', 'name']
      }
    ],
    limit: 10,
    attributes: ['id', 'name', 'avatar'],
    order: 'id DESC'
  });

  res.send({users})
});


module.exports.searchUserByName = coroutine(function*(req, res) {
  let users = yield db.User.searchUserByName(req.query.name, req.user.id);

  res.send({users})
});

module.exports.registration = coroutine(function*(req, res) {
  const {name: name_db, email: email_db, password: password_db, ref} = req.body;
  const salt = makeSalt();
  const isExist = yield db.User.find({where: {email: email_db}});

  if (isExist) {
    res.send({error: 'Email already exist'});
    return;
  }

  const data = yield db.User.create({
    name: name_db,
    email: email_db,
    password: encryptPassword(password_db, salt),
    salt
  });

  const {name, nickname, email, id, steam_id, confirmed} = data.dataValues;

  if (ref) {
    const isRefUserExist = yield db.User.findOne({where: {id: _.escape(ref)}});
    if (isRefUserExist) {
      db.UserRefereals.create({
        referal_id: _.escape(ref),
        invited_user: id
      });
    }
  }

  /* Sending activation URL email */
  const hash = randomString(32);
  db.UserConfirms.create({
    hash: hash,
    user_id: id,
    action: 'email_confirm'
  });

  nodeMailer.send(email, 'Email confirmation', `Confirm your email: <a href="http://${siteUrl}/email-confirm?key=${hash}" target="_blank">activate</a>`);
});

module.exports.confirmEmail = coroutine(function*(req, res) {
  if (!req.query.key) {
    return;
  }

  const hash = req.query.key;

  const confirmation = yield db.UserConfirms.findOne(
    {
      where: {
        hash: hash,
        action: 'email_confirm'
      }
    }
  );
  if (confirmation) {
    const user = yield db.User.findOne({
      where: confirmation.user_id
    });
    user.confirmed = true;
    user.save();
    confirmation.destroy();
    res.send({confirmed: user.confirmed});
  } else {
    res.send({message: 'Hash inactive'});
  }
});

module.exports.postConfirm = coroutine(function*(req, res) {
  const user = yield db.User.findOne({
    where: {
      steam_id: req.user.steam_id
    }
  });
  if (!user.password && req.body.password) {
    const salt = makeSalt();

    /* Store user password */
    user.password = encryptPassword(req.body.password, salt);
    user.salt = salt;
    user.save();

  }
  if (!user.email && req.body.email) {

    /* Store user email */
    user.email = req.body.email;
    user.save();

    /* Sending activation URL email */
    const hash = randomString(32);
    db.UserConfirms.create({
      hash: hash,
      user_id: req.user.id,
      action: 'email_confirm'
    });
    nodeMailer.send(user.email, 'Email confirmation', `Your password ${req.body.password}<br/> Confirm your email: <a href="http://${siteUrl}/email-confirm?key=${hash}">activate</a>`);

    res.send(user.email);
  } else {
    res.status(403).send({message: "Settings not stored"})
  }
});

module.exports.getNotifications = coroutine(function*(req, res) {
  const notifications = yield db.UserNotifications.findAll({
    where: {
      user_id: req.user.id
    },
    include: [
      {
        model: db.User,
        as: 'author',
        attributes: ['id', 'name', 'avatar']
      },
      {
        model: db.UserFriends,
        as: 'friendInvite',
        attributes: ['id', 'confirmed'],
        required: false
      },
      {
        model: db.TeamUser,
        as: 'teamInvite',
        attributes: ['id', 'confirmed'],
        required: false
      }
    ],
    attributes: ['id', 'title', 'message', 'created_at', 'checked'],
    order: 'id DESC'
  });

  db.UserNotifications.update(
    { checked: true, },
    { where: {  user_id: req.user.id,  checked: false, } }
  );

  res.send(notifications)
});

module.exports.getNewNotifications = coroutine(function*(req, res) {
  const count = yield db.UserNotifications.count({
    where: {
      user_id: req.user.id,
      checked: false
    },
  });

  res.send({count})
});

module.exports.postUserInformation = coroutine(function*(req, res) {

  const user = yield db.User.findOne({
    where: {
      id: req.user.id
    }
  });
  let isSettingsSaved = false;

  /* Store new user data */

  const storeData = {};

  if(req.body.new_password)
    if (authenticate(req.body.old_password, user.salt, user.password)) {
      const salt = makeSalt();
      if (req.body.new_password !== req.body.new_password_repeat)
        return res.send({error: "Password repeat wrong"});
      storeData.password = encryptPassword(req.body.new_password, salt);
      storeData.salt = salt;
    } else {
      return res.send({error: "Old password wrong"});
    }

  if (req.body.nickname && req.body.nickname !== user.nickname) {
    storeData.nickname = req.body.nickname;
  }

  if (req.body.name && req.body.name !== user.name) {
    storeData.name = req.body.name;
  }

  if (req.body.tags instanceof Array) {
    let tags = req.body.tags;
    let userTags = yield db.UserTags.destroy({where: {user_id: req.user.id}});

    for(let i in tags) {
      if(typeof tags[i] === 'number') {
        db.UserTags.create({tag_id: tags[i], user_id: req.user.id})
      } else {
        let tag = yield db.Tags.create({name: tags[i]});
        db.UserTags.create({tag_id: tag.id, user_id: req.user.id})
      }
    }
  }

  /* Sending activation URL email */
  if (!_.isEmpty(storeData)) {
    const hash = randomString(32, 48);
    db.UserConfirms.create({
      hash: hash,
      user_id: 1,
      store_data: JSON.stringify(storeData),
      action: 'data_change'
    });

    nodeMailer.send(user.email, 'Data change requested', `You've requested your personal data change. <a href="http://${siteUrl}/data-confirm?key=${hash}">Confirm it</a> or don't do anything`);

    res.send({email: "Confirmation message sent"});
    return;
  }

  if (isSettingsSaved) {
    res.send({error: "Settings saved"});
  } else {
    res.send({error: "Settings not stored"});
  }
});

module.exports.uploadAvatar = coroutine(function*(req, res) {
  if (!req.file || req.file.size > 204800) {
    return res.send({error: 'Size higher then 200kb'});
  }

  const user = yield db.User.findById(req.user.id);
  let data = req.file.buffer;

  let type = req.file.mimetype.match(/\/+(.*)/);
  let name = `${shortid.generate()}${type ? `.${type[1]}` : '.png'}`;
  yield fs.writeFileAsync(`${dirname}/server/storage/user/${name}`, data);

  user.avatar = name;
  user.save();

  res.send({name});
});


module.exports.confirmDataChange = coroutine(function*(req, res) {
  if (!req.query.key) {
    return;
  }

  const hash = req.query.key;

  const confirmation = yield db.UserConfirms.findOne(
    {
      where: {
        hash: hash,
        action: 'data_change'
      }
    }
  );

  if (confirmation) {
    const user = yield db.User.findOne({
      where: confirmation.user_id
    });
    try {
      const data = JSON.parse(confirmation.store_data);
      user.update(data);
      confirmation.destroy();
      res.send({message: 'Data saved'});
    } catch (e) {
      res.send({message: 'Some error happen'});
    }
  } else {
    res.send({message: 'Hash inactive'});
  }

});

module.exports.getUserFriends = coroutine(function*(req, res) {
  const user = yield db.User.findOne({
    where: {
      id: req.user.id
    },
    // include: [db.UserDotaStats],
    attributes: ['id', 'name', 'nickname', 'steam_id', 'avatar']
  });
  // Need update by user ?
  // this.updateDotaStats(req, res, result);

  res.send({user});
});

module.exports.getUserInformationById = coroutine(function*(req, res) {
  let {id} = req.params;
  id = parseInt(_.escape(id));
  if (_.isNaN(id)) {
    return;
  }
  const user = yield db.User.getPublicUser(id);

  res.send({user});
});

module.exports.getUserInformation = coroutine(function*(req, res) {
  const user = yield db.User.getUser(req.user.id);

  if(user) {
    if (user.dataValues.UserDotaStat ? Date.parse(user.dataValues.UserDotaStat.updated_at) + steamConfig.refreshRate > Date.now() : true)
      this.updateDotaStats(req, res, user);
    if (user.dataValues.UserCsgoStat ? Date.parse(user.dataValues.UserCsgoStat.updated_at) + steamConfig.refreshRate > Date.now() : true)
      this.updateCsgoStats(req, res, user);
  }

  res.send({user});
}).bind(this);

module.exports.updateGameStats = coroutine(function*(req, res) {
  const user = yield db.User.findOne({
    where: {
      $or: [
        {
          email: {
            $eq: req.user.email
          }
        },
        {
          steam_id: {
            $eq: req.user.steam_id
          }
        }
      ]
    },
    include: [db.UserDotaStats, db.UserCsgoStats],
    attributes: ['id', 'name', 'nickname', 'confirmed', 'email', 'manual_stats_update']
  });

  if (!user.manual_stats_update || Date.now() > new Date(user.manual_stats_update).getTime()) {
    this.updateDotaStats(req, res, user);
    this.updateCsgoStats(req, res, user);

    user.manual_stats_update = Date.now() + steamConfig.manualUpdateDelay * 1000;
    user.save();
  }

  res.send({user: user});
}).bind(this);

module.exports.updateCsgoStats = coroutine(function*(req, res, result) {

  if (req.user.steam_id && result) {

    const {UserCsgoStat} = result.dataValues;

    const steamCsgoStats = yield steamApi.getUserStats(req.user.steam_id);

    /* UserCsgoStats */
    if (steamCsgoStats) {
      let steamStats = steamCsgoStats.userStats.playerstats.stats;
      let prepareStats = {};
      for (let i = 0; steamStats.length > i; i++) {
        prepareStats[steamStats[i].name] = steamStats[i].value;
      }
      const {total_kills, total_deaths, total_wins, total_damage_done, total_money_earned, total_kills_headshot} = prepareStats;
      const newStats = {
        user_id: req.user.id,
        total_kills,
        total_deaths,
        total_wins,
        total_damage_done,
        total_money_earned,
        total_kills_headshot
      };

      if (!UserCsgoStat) {
        db.UserCsgoStats.create(newStats);
      } else {
        UserCsgoStat.update(newStats);
      }
    }
  }

});

module.exports.updateDotaStats = coroutine(function*(req, res, result) {

  if (req.user.steam_id && result) {

    const {UserDotaStat, UserDotaRecord} = result.dataValues;

    const openDotaStats = yield openDota.getUserStats(req.user.steam_id);

    /* UserDotaStats */
    const {solo_competitive_rank, competitive_rank} = openDotaStats.userStats;
    const {win, lose} = openDotaStats.userWinLose;
    const newStats = {
      user_id: req.user.id,
      solo_mmr: solo_competitive_rank,
      party_mmr: competitive_rank,
      win,
      lose
    };

    if (!UserDotaStat) {
      db.UserDotaStats.create(newStats);
    } else {
      UserDotaStat.update(newStats);
    }

    /* UserDotaHeroes */
    if(openDotaStats.userHeroes)
      openDotaStats.userHeroes.forEach((item) => {
        let heroStats = {
          user_id: req.user.id,
          hero_id: item.hero_id,
          games: item.games,
          win: item.win,
          last_time: new Date(item.last_played * 1000)
        };
        db.UserDotaHeroes.findOrCreate({
          where: {hero_id: item.hero_id, user_id: req.user.id},
          defaults: heroStats
        }).then(function (record) {
          record[0].update(heroStats);
        });
      });
  }
});

module.exports.getUserDotaStats = coroutine(function*(req, res) {
  let {id} = req.params;
  id = parseInt(_.escape(id));
  if (_.isNaN(id)) {
    return;
  }
  const heroes = yield db.UserDotaHeroes.getUserHeroes(id);

  res.send({heroes});
});

module.exports.logout = logout;

module.exports.login = login;

module.exports.isAuth = isAuth;
