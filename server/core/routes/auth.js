/**
 * Module dependencies.
 */
const _ = require('lodash');
const express = require('express');
const router = new express.Router();

module.exports = (pAuth, passport) => router
  .get('/steam',
    passport.authenticate('steam'),
    function (req, res) {
    })
  .get('/steam/response',
    function(req, res, next){
      req.url = req.originalUrl; next();
    },
    passport.authenticate('steam', {failureRedirect: '/'}),
    function (req, res) {
      res.redirect('/');
    });
