const fs = require('fs');
const path = require('path');
const {database} = require('../config');
const Sequelize = require('sequelize');
const lodash = require('lodash');
const db = {};

const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    port: database.port,
    logging: false,
    dialect: 'mysql'
  }
);

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0 && file !== 'index.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db)
  }
});

module.exports = lodash.extend({
  sequelize,
  Sequelize
}, db);
