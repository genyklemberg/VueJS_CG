'use strict';

/**
 * Module dependencies.
 */
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const {mail} = require('../config');

/**
 * Expose
 */

module.exports.send = (receiver, subject, message) => {

  let nodemailerMailgun = nodemailer.createTransport(mg({
    auth: {
      api_key: mail.api_key,
      domain: mail.domain
    }
  }));

  nodemailerMailgun.sendMail({
    from: mail.sender,
    to: receiver,
    subject: subject,
    html: message
  }, function (err, info) {
    if (err) {
      console.log('Error: ' + err);
    }
    else {
      console.log('Response: ' + info);
    }
  });

};
