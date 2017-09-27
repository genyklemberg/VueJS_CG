const db = require('../models');
const _ = require('lodash');
const config = require('../config');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const shortid = require('shortid');
const coroutine = require('bluebird').coroutine;

module.exports.getTeam = coroutine(function*(req, res) {
  let { id } = req.params;
  id = parseInt(_.escape(id));
  if (_.isNaN(id)) {
    return;
  }
  const team = yield db.Team.getUserTeam(id);

  res.send({ team });
});

module.exports.sendTeamInvite = coroutine(function* (req, res) {
  const {team_id, user_id, message} = req.body;

  const user = yield db.User.findById(user_id);
  const team = yield db.Team.findById(team_id);

  if(user && user.id !== req.user.id) {
    let request = yield db.TeamUser.findOrCreate({where: {
      user_id: user.id,
      team_id: team.id
    }});
    if(request) {
      db.UserNotifications.create({
        team_request_id: request[0].id,
        author_id: req.user.id,
        user_id: user.id,
        title: "Team invite",
        message
      });
    }
    res.send({success: 'Invite sent'});
  } else {
    res.send({error: 'User not found'});
  }
});

module.exports.createTeam = coroutine(function* (req, res) {
  const { name, game_id } = req.body;
  if (!name || !game_id) {
    return res.send({error: 'No name or game'});
  }

  /*todo check error owner not set*/
  const team = yield db.Team.create({
    name,
    game_id,
    owner_id: req.user.id
  });

  db.TeamUser.create({
    team_id: team.id,
    user_id: req.user.id,
    manage: true,
    edit: true,
    posting: true,
    confirmed: 1
  });

  if(team) {
    res.send({team});
  } else {
    res.send({error: 'Error while creating team'});
  }
});

module.exports.updateTeam = coroutine(function* (req, res) {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.send({error: 'No id or name'});
  }

  const team = yield db.Team.findById(id);

  team.name = name;
  team.save();

  if(team) {
    res.send({team});
  } else {
    res.send({error: 'Error while updating team'});
  }
});

module.exports.updateMate = coroutine(function* (req, res) {
  const { id, manage, edit, posting } = req.body;
  if (!id) {
    return res.send({error: 'User not found'});
  }

  const mate = yield db.TeamUser.findUserTeam(id);

  mate.manage = manage;
  mate.edit = edit;
  mate.posting = posting;
  mate.save();

  if(mate) {
    res.send({success: 'Team mate edited'});
  } else {
    res.send({error: 'Error while updating team mate'});
  }
});

module.exports.confirmTeamInvite = coroutine(function*(req, res) {
  const request = yield db.TeamUser.findById(req.body.request_id);
  if (request && !request.confirmed && (req.user.id === request.user_id)) {
    request.confirmed = 1;
    request.save();

    res.send({success: "Request confirmed"})
  } else {
    res.send({error: "Request not found"})
  }
});

module.exports.removeUser = coroutine(function*(req, res) {
  const userTeam = yield db.TeamUser.findUserTeam(req.user.id);
  const teamMate = yield db.TeamUser.findUserTeam(req.body.user_id);
  if (teamMate && (userTeam.team_id === teamMate.team_id)) {
    teamMate.destroy();
    res.send({success: "Mate removed"})
  } else {
    res.send({error: "Mate not found"})
  }
});

module.exports.uploadAvatar = coroutine(function*(req, res) {
  const { team_id } = req.body;
  if (!team_id) {
    return res.send({error: 'No team id'});
  }

  if (!req.file || req.file.size > 204800) {
    return res.send({error: 'Size higher then 200kb'});
  }

  const team = yield db.Team.findById(team_id);
  let data = req.file.buffer;

  let type = req.file.mimetype.match(/\/+(.*)/);
  let name = `${shortid.generate()}${type ? `.${type[1]}` : '.png'}`;
  yield fs.writeFileAsync(`${config.dirname}/server/storage/team/${name}`, data);

  team.avatar = name;
  team.save();

  res.send({name});
});
