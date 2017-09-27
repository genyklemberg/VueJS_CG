/**
 * Module dependencies.
 */
const express = require('express');
const router = new express.Router();
const system = require('../../../controllers/system');

module.exports = (pauth) => router
  .get('/localization/:key', system.getLocalization)
  .get('/games', system.getGames)
  .get('/dota-heroes', system.updateDotaHeroes)
  .get('/tags?', system.searchTags);
