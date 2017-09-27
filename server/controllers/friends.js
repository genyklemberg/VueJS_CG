const db = require('../models');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const coroutine = require('bluebird').coroutine;

module.exports.getUserFriends = coroutine(function*(req, res) {
  let {id} = req.params;
  id = parseInt(_.escape(id));
  if (_.isNaN(id)) {
    return;
  }
  const friends = yield db.UserFriends.getUserFriends(id);

  res.send({friends});
});

module.exports.friendRequest = coroutine(function*(req, res) {
  if (req.user.id && req.body.user_id) {
    const friend = yield db.User.findById(req.body.user_id);
    if (friend && req.user.id !== friend.id) {
      let isFriends = yield db.UserFriends.findUserFriend(req.user.id, friend.id);
      if (!isFriends) {
        /* Check is user already sent friend request */
        let crossRequest = yield db.UserFriends.findUserFriend(friend.id, req.user.id);
        if (crossRequest) {
          crossRequest.confirmed = 1;
          crossRequest.save();
          db.UserFriends.createFriend(req.user.id, crossRequest.user_id, true);
          res.send({success: "Friend added"})
        } else {
          let friendship = yield db.UserFriends.createFriend(req.user.id, friend.id, false);
          db.UserNotifications.createNotification(req.user.id, friend.id, "Friend invite", "Would like to add you to my friends list", friendship.id, null);
          res.send({success: "Request sent"})
        }
      } else {
        res.send({success: "Request already sent"})
      }
    } else {
      res.send({error: "User not found"})
    }
  }
});

module.exports.friendConfirm = coroutine(function*(req, res) {
  if (req.user.id && req.body.request_id) {
    const request = yield db.UserFriends.findById(req.body.request_id);
    if (request && !request.confirmed) {
      request.confirmed = 1;
      request.save();

      db.UserFriends.createFriend(req.user.id, request.user_id, true);
      res.send({success: "Request confirmed"})
    } else {
      res.send({error: "Request not found"})
    }
  }
});

module.exports.friendRemove = coroutine(function*(req, res) {
  if (req.user.id && req.body.friend_id) {
    const friendship = yield db.UserFriends.findUserFriend(req.user.id, req.body.friend_id);
    if (friendship) {
      friendship.destroy();
      res.send({success: "Friend removed"})
    } else {
      res.send({error: "Friend not found"})
    }
  }
});
