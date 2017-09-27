/**
 * Module dependencies.
 */
const express = require('express');
const router = new express.Router();
const friends = require('../../../controllers/friends');
const users = require('../../../controllers/users');
const { ensureAuthenticated } = require('../../middlewares/authorization');
const multer  = require('multer');
const upload = multer();

module.exports = (pauth) => router
  .get('/token', users.getToken)
  .get('/notifications/count', users.getNotificationsCount)
  .get('/filter?', users.getUserByFilter)
  .get('/logout', ensureAuthenticated, users.logout)
  .post('/registration', users.registration)
  .post('/login', pauth('local'), users.login)
  .get('/data-confirm?', ensureAuthenticated, users.confirmDataChange)
  .post('/confirm', ensureAuthenticated, users.postConfirm)
  .post('/update-stats', ensureAuthenticated, users.updateGameStats)
  .get('/email-confirm?', ensureAuthenticated, users.confirmEmail)
  .get('/notifications', ensureAuthenticated, users.getNotifications)
  .get('/notifications/new', ensureAuthenticated, users.getNewNotifications)
  .post('/avatar', ensureAuthenticated, upload.single('avatar'), users.uploadAvatar)
  .get('/search', ensureAuthenticated, users.searchUserByName)
  .post('/', ensureAuthenticated, users.postUserInformation)
  .get('/', ensureAuthenticated, users.getUserInformation)
  .get('/:id/dota', users.getUserDotaStats)
  .get('/:id', users.getUserInformationById);
