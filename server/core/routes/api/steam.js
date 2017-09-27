/**
 * Module dependencies.
 */
const express = require('express');
const router = new express.Router();
const steam = require('../../../controllers/steam');
const { ensureAuthenticated } = require('../../middlewares/authorization');

module.exports = (pauth) => router
  .get('/stats/:gameId', ensureAuthenticated, steam.getStats);
