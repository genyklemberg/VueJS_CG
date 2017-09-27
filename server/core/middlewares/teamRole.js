'use strict';

const coroutine = require('bluebird').coroutine;
const db = require('../../models');

/*
 *  Generic require login routing middleware
 */

exports.ensureCanManage = coroutine(function* (req, res, next) {
  const teamUser = yield db.TeamUser.findUserTeam(req.user.id);

  if (req.isAuthenticated() && teamUser.manage) {
    return next();
  }
  res.status(401).send({error: 'unauthorized'});
});

exports.ensureCanEdit = coroutine(function* (req, res, next) {
  const teamUser = yield db.TeamUser.findUserTeam(req.user.id);

  if (req.isAuthenticated() && teamUser.edit) {
    return next();
  }
  res.status(401).send({error: 'unauthorized'});
});
