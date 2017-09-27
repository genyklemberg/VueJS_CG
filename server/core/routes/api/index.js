/**
 * Module dependencies.
 */
const _ = require('lodash');
const express = require('express');
const router = new express.Router();
const newsRouter = require('./news');
const userRouter = require('./user');
const teamsRoutes = require('./team');
const friendsRoutes = require('./friends');
const steamRouter = require('./steam');
const matchesRouter = require('./matches');
const systemRouter = require('./system');

module.exports = (pauth) => router
  .use('/news', newsRouter(pauth))
  .use('/matches', matchesRouter(pauth))
  .use('/system', systemRouter(pauth))
  .use('/steam', steamRouter(pauth))
  .use('/friends', friendsRoutes(pauth))
  .use('/user', userRouter(pauth))
  .use('/team', teamsRoutes(pauth));
