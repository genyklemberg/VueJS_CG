'use strict';

/*
 * Module dependencies.
 */

const path = require("path");
const express = require("express");
const { dirname, server, development } = require('../../config');
const apiRouter = require('./api/index');
const authRouter = require('./auth');

/**
 * Expose routes
 */

module.exports = function (app, passport) {
  const pAuth = passport.authenticate.bind(passport);

  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", `http://${server.host}:${server.port}`);
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });

  /* Server routes */
  app.use('/auth', authRouter(pAuth, passport));
  app.use('/api', apiRouter(pAuth));
  app.use('/storage', express.static(path.join(dirname + '/server/storage')));

  /* Client routes */
  app.use('/assets', express.static(dirname + '/client/dist/assets'));

  /* Webpack for development */
  if(development) {
    require('../middlewares/webpack')(app);
  } else {
    app.get('/*', (req, res) => {
      res.sendFile(path.join(dirname + '/client/dist/index.html'));
    });
  }

};
