'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require('compression');
const { dirname } = require('../../config');

/**
 * Expose
 */

module.exports = (app, passport) => {
  app.use(compression({
    threshold: 512
  }));

  app.use('/static', express.static(dirname + '/dist/static'));

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  // CookieParser should be above session
  app.use(cookieParser());
  app.use(cookieSession({secret: 'UserSecretString1'}));
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'UserSecretString1'
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  app.locals.pretty = true;
};
