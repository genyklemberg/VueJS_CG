const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const url = require("url");
const requestPromise = require("request-promise");

module.exports.makeSalt = () => {
  return Math.round((new Date().valueOf() * Math.random() * 2)) + '';
};

module.exports.randomString = (length) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * (chars.length - 1))];
  }
  return result;
};


module.exports.encryptPassword = (password, salt) => {
  if (!password) {
    return '';
  }
  try {
    return crypto
      .createHmac('sha1', salt)
      .update(password)
      .digest('hex');
  } catch (err) {
    return '';
  }
};

module.exports.authenticate = (plainText, salt, hashed_password) => {
  return this.encryptPassword(plainText, salt) === hashed_password;
};

module.exports.base64image = (base64Str, imgPath, options) => {

  function decodeBase64Image(base64Str) {
    let matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let image = {};
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    image.type = matches[1];
    image.data = new Buffer(matches[2], 'base64');

    return image;
  }

  if (!base64Str || !imgPath) {
    throw new Error('Missing mandatory arguments base64 string and/or path string');
  }

  let imageBuffer = decodeBase64Image(base64Str);
  let imageType = imageBuffer.type || 'png';
  let fileName = new Buffer(options.name ? options.name : this.randomString(6)).toString('base64');

  if (fileName.indexOf('.') === -1) {
    imageType = imageType.replace('image/', '');
    fileName = fileName + '.' + imageType;
  }

  let abs = path.join(__dirname, `../../${imgPath}`) + fileName;
  fs.writeFile(abs, imageBuffer.data, 'base64', function(err) {
    if(err) console.log("File image write error", err);
  });
  return fileName;

};

module.exports.requestUrl = (reqUrl) => {
  const options = {
    uri: reqUrl,
    method: 'GET'
  };

  return requestPromise(options);
};
