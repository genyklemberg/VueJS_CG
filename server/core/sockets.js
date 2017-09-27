'use strict';

/*
 * Module dependencies.
 */

const config = require('../config');
const socketioJwt = require("socketio-jwt");
const jwt = require('jsonwebtoken');
const db = require('../models');

let sockets = null;
let userSocket = null;
let usersOnline = 0;

/**
 * Expose sockets
 */

module.exports.connect = (app) => {

  const io = require("socket.io")(app);

  io.set('origins', `${config.server.host}:*`);

  io.on('connection', socketioJwt.authorize({
    secret: config.jwt.secret
  }));

  io.on('connection', function (client) {
    sockets = io.sockets;
    usersOnline = Object.keys(sockets.sockets).length;

    sockets.emit('online', usersOnline);

    userSocket = (channel, message, userId) => {
      for (let socket in sockets.sockets) {
        if (parseInt(sockets.sockets[socket].userId) === userId) {
          sockets.to(socket).emit(channel, message);
        }
      }
    };
    client.on('disconnect', function () {
      usersOnline = Object.keys(sockets.sockets).length;
      sockets.emit('online', usersOnline);
    });
  });

  io.on('authenticated', function (socket) {
    socket.emit('user', socket.decoded_token);
    if(socket.decoded_token.user_id)
      socket.userId = socket.decoded_token.user_id
  });
};

module.exports.sockets = (channel, message) => {
  if(sockets)
    sockets.emit(channel, message);
};

module.exports.socket = (channel, message, userId) => {
  if(userSocket) {
    userSocket(channel, message, userId);
  } else if(sockets) {
    for (let socket in sockets.sockets) {
      if (parseInt(sockets.sockets[socket].userId) === userId) {
        sockets.to(socket).emit(channel, message);
      }
    }
  }
};
