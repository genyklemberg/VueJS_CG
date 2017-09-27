'use strict';

/*
 *  Generic require login routing middleware
 */

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({error: 'unauthorized'});
};
