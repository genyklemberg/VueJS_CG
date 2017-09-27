const _ = require('lodash');
const request = require('request');
const coroutine = require('bluebird').coroutine;
const db = require('../models');

module.exports.registration = coroutine(function* (req, res) {
  const { id: steam_db_id, displayName, photos } = req.user;
  const fullPhoto = _.last(photos);
  const [data] = yield db.User.findOrCreate({
    where: {
      steam_id: steam_db_id
    },
    defaults: {
      name: displayName,
      steam_id: steam_db_id,
      avatar: fullPhoto.hasOwnProperty('value') ? fullPhoto.value : null,
      language: 'en',
      trade_offer: 'https://steamcommunity.com/tradeoffer/new'
    }
  });

  const { name, nickname, email, id, steam_id } = data.dataValues;
  req.logIn({ name, nickname, email, id, steam_id }, err => {
    if (err) {
      res.send({error: 'Sorry! We are not able to log you in!'});
    }
    res.redirect('/');
  });
});


module.exports.getStats = coroutine(function* (req, res) {
  const { gameId } = req.params;
  if (_.isNaN(Number(gameId))) {
    return res.send({error: 'No such game'});
  }
  if (!req.user.steam_id) {
    return res.send({error: 'No steam ID'});
  }
});
