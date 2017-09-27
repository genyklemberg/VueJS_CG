'use strict';

/**
 * Module dependencies.
 */

const SteamStrategy = require('passport-steam').Strategy;
const {server, steamConfig, dirname} = require('../../config');
const coroutine = require('bluebird').coroutine;
const db = require('../../models');
const shortid = require('shortid');
const request = require('request').defaults({ encoding: null });
const Promise = require('bluebird');
const fs = require('fs');

/**
 * Expose
 */

module.exports = new SteamStrategy({
    returnURL: `${server.port === 403 ? `https://` : `http://`}${server.host}:${server.port}/auth/steam/response`,
    realm: `${server.port === 403 ? `https://` : `http://`}${server.host}`,
    apiKey: steamConfig.apiKey,
    passReqToCallback: true
  },
  coroutine(function*(req, identifier, profile, done) {
    let user = yield db.User.findOne({
      where: {
        steam_id: profile._json.steamid
      },
      attributes: ['id', 'name', 'avatar', 'steam_id']
    });
    let name = profile._json.personaname.replace(/((http|https|ftp|ftps)\:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}/gi, "");
    if (!user) {
      user = yield db.User.create({
        name,
        steam_id: profile._json.steamid
      });
    } else {
      user.name = name;
      user.save();
    }
    let avatarName = `${shortid.generate()}.png`;
    let data;

    if(!user.avatar)
      request.get(profile._json.avatarfull, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          data = new Buffer(body);
          fs.writeFileAsync(`${dirname}/server/storage/user/${avatarName}`, data);
          user.avatar = avatarName;
          user.save();
        }
      });

    return done(null, user);
  })
);
