/**
 * Module dependencies.
 */
const express = require('express');
const router = new express.Router();
const matches = require('../../../controllers/matches');

module.exports = (pauth) => router
  .get('/future', matches.getFutureMatches)
  .get('/current', matches.getCurrentMatches)
  .get('/tournaments/information/:id', matches.getTournamentInfo)
  .get('/tournaments/:id', matches.getTournamentById);
