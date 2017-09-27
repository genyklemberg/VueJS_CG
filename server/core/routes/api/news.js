/**
 * Module dependencies.
 */
const express = require('express');
const router = new express.Router();
const news = require('../../../controllers/news');
const { ensureAuthenticated } = require('../../middlewares/authorization');
const multer  = require('multer');
const upload = multer();

module.exports = (pauth) => router
  .get('/', news.getNews)
  .post('/filter', news.getNewsByFilter)
  .get('/:id', news.getSingleNewsById)
  .get('/:id/shared', news.getWhoShared)
  .get('/:id/comment', news.getNewsCommment)
  .get('/user/:id', news.getUserNews)
  .post('/add', ensureAuthenticated, news.addNews)
  .post('/share', ensureAuthenticated, news.shareNews)
  .post('/like', ensureAuthenticated, news.likeNews)
  .post('/image', ensureAuthenticated, upload.single('image'), news.uploadImage)
  .post('/comment', ensureAuthenticated, news.commentNews);
