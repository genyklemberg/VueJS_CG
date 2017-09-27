'use strict';

const {server} = require('../client/config');
const {dirname} = require('../config');

module.exports = {
  server,
  dirname,
  development: false,
  mail: {
    sender: "postmaster@mg.cybergates.co",
    api_key: "key-685c46166f0607fbf761f2ce8b4329a0",
    domain: "https://api.mailgun.net/v3/mg.cybergates.co"
  },
  database: {
    user: 'root',
    password: 'bzJLE9rrYjtd',
    name: 'gcl',
    host: '127.0.0.1', //'192.168.99.100',
    port: '3306',
    dialect: 'mariadb',
    dateStrings: 'DATE'
  },
  jwt: {
    secret: '1Ud5cZl8H7y7doYSYGndorZ4ecOadMam',
    options: {
      audience: 'http://127.0.0.1',
      expiresIn: '12h', // 1d
      issuer: '127.0.0.1'
    },
    cookie: {
      httpOnly: true,
      sameSite: true,
      signed: true,
      secure: true
    }
  },
  steamConfig: {
	  manualUpdateDelay: 1800, //30mins
	  refreshRate: 86400, // 1 day
    apiKey: 'BB26BC9D9485F440C03212DFD717B267',
  }
};
