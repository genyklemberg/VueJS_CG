/**
 * Module dependencies.
 */
const express = require('express');
const router = new express.Router();
const teams = require('../../../controllers/teams');
const { ensureAuthenticated } = require('../../middlewares/authorization');
const { ensureCanManage, ensureCanEdit } = require('../../middlewares/teamRole');
const multer  = require('multer');
const upload = multer();

module.exports = (pauth) => router
  .get('/:id', ensureAuthenticated, teams.getTeam)
  .post('/confirm', ensureAuthenticated, teams.confirmTeamInvite)
  .post('/invite', ensureAuthenticated, ensureCanManage, teams.sendTeamInvite)
  .post('/remove', ensureAuthenticated, ensureCanManage, teams.removeUser)
  .post('/', ensureAuthenticated, ensureCanEdit, teams.updateTeam)
  .post('/mate', ensureAuthenticated, ensureCanEdit, teams.updateMate)
  .post('/avatar', ensureAuthenticated, ensureCanEdit, upload.single('avatar'), teams.uploadAvatar)
  .post('/create', ensureAuthenticated, teams.createTeam);
