/**
 * Module dependencies.
 */
const express = require('express');
const router = new express.Router();
const friends = require('../../../controllers/friends');
const { ensureAuthenticated } = require('../../middlewares/authorization');

module.exports = (pauth) => router
  .get('/user/:id', ensureAuthenticated, friends.getUserFriends)
  .post('/request', ensureAuthenticated, friends.friendRequest)
  .post('/confirm', ensureAuthenticated, friends.friendConfirm)
  .post('/remove', ensureAuthenticated, friends.friendRemove);
