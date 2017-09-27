'use strict';

/**
 * Module dependencies.
 */
const { steamConfig } = require('../config');
const { dirname } = require('../../config');
const { requestUrl } = require('../utils');
const coroutine = require('bluebird').coroutine;

/**
 * Variables
 */
const apiUrl = 'http://api.steampowered.com';
const userRoutes = (steamId64) => {
  return {
    userStats: `${apiUrl}/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${steamConfig.apiKey}&steamid=${steamId64}`,
  };
};

/**
 * Expose
 */

/* steamId64: Steam64 account ID */
module.exports.getUserStats = coroutine(function* (steamId64) {
  const result = {};
  const apiUrls = userRoutes(steamId64);
  for (let url in apiUrls) {
    try {
      result[url] = JSON.parse(yield requestUrl(apiUrls[url]));
    } catch (e) {
      console.log(e)
    }
  }
  return result;
});
