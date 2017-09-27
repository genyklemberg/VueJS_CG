const _ = require('lodash');
const fs = require('fs');
const coroutine = require('bluebird').coroutine;
const db = require('../models');
const {dirname} = require('../config');
const {isUserAuth} = require('./abstractUser');
const localizations = {};
const openDota = require('../api/opendota');

/* Read all localization files */
fs.readdirSync(`${dirname}/server/localization`)
  .forEach(file => {
    const localizationName = file.replace('.json', '');
    localizations[localizationName] = require(`${dirname}/server/localization/${file}`);
  });

module.exports.getGames = coroutine(function*(req, res) {
  const games = yield db.Game.findAll();

  res.send({games});
});

module.exports.searchTags = coroutine(function*(req, res) {
  const query = req.query.query;

  const tags = yield db.Tags.searchTags(query);

  res.send({tags});
});

module.exports.updateDotaHeroes = coroutine(function*(req, res) {
  const heroesData = yield openDota.getHeroes();

  for (let i in heroesData) {
    let {id, localized_name, primary_attr, attack_type, img} = heroesData[i];
    let roles;
    try {
      roles = JSON.stringify(heroesData[i].roles);
    } catch (e) {
    }
    let hero = {
      id, name: localized_name, primary_attr, attack_type, img, roles
    };
    let heroModel = yield db.DotaHeroes.findById(hero.id);
    if (heroModel) {
      yield heroModel.update(hero);
    } else {
      yield db.DotaHeroes.create(hero)
    }
  }

  let heroes = yield db.DotaHeroes.findAll();

  res.send({heroes});
});

module.exports.getLocalization = function (req, res) {
  if (!req.params.key) {
    return res.send({localization: localizations.en});
  }
  const localization = localizations[req.params.key];
  if (isUserAuth(req)) {
    const authLocalization = localizations[req.params.key + '_auth'];
    if (!_.isEmpty(authLocalization)) {
      _.merge(localization, authLocalization)
    }
  }
  res.send({localization});
};
