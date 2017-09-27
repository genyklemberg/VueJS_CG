'use strict';

/**
 * Module dependencies.
 */

const LocalStrategy = require('passport-local').Strategy;
const db = require('../../models/index');
const { authenticate } = require('../../utils/index');
/**
 * Expose
 */
module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    db.User.findOne({
      where: {
        email
      },
      attributes: ['email', 'id', 'name', 'nickname', 'password', 'salt']
    }).then((data) => {
      if (!data || !data.dataValues) {
        return done(null, false, { message: 'Unknown user' });
      }
      const userData = data.dataValues;
      if (!authenticate(password, userData.salt, userData.password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      const { email, id, name, nickname } = data.dataValues;
      return done(null, { email, id, name, nickname });
    }).catch(err => {
      done(null, false, { message: 'Unknown user' })
    });
  }
);
