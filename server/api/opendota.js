'use strict';

/**
 * Module dependencies.
 */
const steamConverter = require('steam-id-convertor');
const { dirname } = require('../../config');
const { requestUrl } = require('../utils');
const coroutine = require('bluebird').coroutine;

/**
 * Variables
 */
const apiUrl = 'https://api.opendota.com/api';
const userRoutes = (steamId32) => {
  return {
    userStats: `${apiUrl}/players/${steamId32}`,
    userWinLose: `${apiUrl}/players/${steamId32}/wl`,
    userHeroes: `${apiUrl}/players/${steamId32}/heroes`
  };
};

/**
 * Expose
 */

/* steamId64: Steam64 account ID */
module.exports.getUserStats = coroutine(function* (steamId64) {
  const steamId32 = steamConverter.to32(steamId64);
  const result = {};
  const apiUrls = userRoutes(steamId32);
  for (let url in apiUrls) {
    try {
      result[url] = JSON.parse(yield requestUrl(apiUrls[url]));
    } catch (e) {
      //console.log(e)
    }
  }
  return result;
});

module.exports.getHeroes = coroutine(function* (steamId64) {
  let result = null;
  try {
    result = JSON.parse(yield requestUrl(`${apiUrl}/heroStats`));
  } catch (e) {
    //console.log(e)
  }
  return result;
});
