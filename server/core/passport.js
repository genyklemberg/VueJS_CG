'use strict';

/*!
 * Module dependencies.
 */

const local = require('./passport/local');
const steam = require('./passport/steam');

/**
 * Expose
 */
module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  // use these strategies
  passport.use(local);
  passport.use(steam);

};
