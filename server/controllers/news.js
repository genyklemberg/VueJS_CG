const _ = require('lodash');
const coroutine = require('bluebird').coroutine;
const db = require('../models');
const {sockets} = require('../core/sockets');
const shortid = require('shortid');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const {dirname, server} = require('../config');

const MAX_NEWS_TAGS = 20;

module.exports.addNews = coroutine(function*(req, res) {
  const {title: title_db, content: content_db, tags} = req.body;
  if (!content_db) {
    return res.send({error: 'No content'});
  }
  if (tags && tags.length && tags.length > MAX_NEWS_TAGS) {
    return res.send({error: 'To much tags'});
  }
  const {id} = yield db.News.create({
    author_id: req.user.id,
    title: title_db || '',
    content: content_db,
    published: 1
  });

  createTagsForNews(tags, id);

  let news = yield db.News.getSingleNews(id);

  sockets('addNews', news);
  res.send(news);
});

const createTagsForNews = (tags, news_id) => {
  if (!_.isArray(tags) || _.isUndefined(news_id)) {
    return;
  }
  for (let tag of tags) {
    const name = _.escape(tag);
    db.Tags.findOrCreateTag(name, news_id);
  }
};

module.exports.shareNews = coroutine(function*(req, res) {
  if (req.body.news_id) {
    let news_id = parseInt(_.escape(req.body.news_id));
    if (_.isNaN(news_id)) {
      return;
    }

    const originalData = yield db.News.findById(news_id);
    const user = yield db.User.findById(req.user.id);
    const data = yield db.News.create({
      original_id: originalData.id,
      original_author_id: originalData.author_id,
      author_id: req.user.id,
      title: originalData.title,
      content: originalData.content,
      published: 1
    });
    originalData.increment('share_count');

    const {id} = data.dataValues;

    let news = yield db.News.getSingleNews(id);

    sockets('shareNews', news_id);

    sockets('addNews', news);

    res.send(news);
  } else {
    res.send({error: 'News not found'});
  }
});

module.exports.getWhoShared = coroutine(function*(req, res) {
  const news = yield getSingleNewsById(req.params.id);
  if (!news) {
    return res.send({error: 'No such news'});
  }
  const shared = yield db.News.getWhoShared(news.id);
  res.send({shared});
});

module.exports.getNews = coroutine(function*(req, res) {
  let news;
  if (req.query.teamId)
    news = yield db.News.getAllPublishedNewsTeam(req.query.teamId);
  else
    news = yield db.News.getAllPublishedNews();

  res.send({news});
});

/** Increasing or decreasing like count in news
 * @param news_id {number} - id of news for decrease/increase like count
 * @param increase {boolean} - if true method will increase, else decrease
 * @return news Promise
 */
const increaseOrDecreaseLikeCount = coroutine(function*(news_id, increase) {
  const newsRecord = yield db.News.findOne({
    where: {
      id: news_id,
      published: 1
    }
  });
  // Check if news record exists in db
  if (newsRecord) {
    const {like_count} = newsRecord.dataValues;
    if (like_count >= 0) {
      newsRecord.like_count = increase ?
        (like_count + 1) :
        like_count > 0 ? like_count - 1 : 0;
      newsRecord.save();
    }
  }
});

const getSingleNewsById = coroutine(function*(news_id) {
  let id = _.clone(news_id);
  id = parseInt(_.escape(id));
  if (_.isNaN(id)) {
    return null;
  }
  const news = yield db.News.findOne({
    where: {
      published: 1,
      id
    },
    attributes: ['id', 'title', 'content', 'views_count', 'comment_count', 'created_at']
  });
  return news;
});

module.exports.commentNews = coroutine(function*(req, res) {
  let {news_id: news_id, comment} = req.body;
  news_id = parseInt(_.escape(news_id));
  comment = _.escape(comment);
  if (_.isNaN(news_id) || !comment || news_id < 0) {
    return;
  }
  const news = yield getSingleNewsById(news_id);

  if (!news) {
    return res.send({error: 'No such news'});
  }
  const createdComment = yield db.NewsComments.create({
    user_id: req.user.id,
    news_id,
    comment
  });

  news.increment('comment_count');

  let response = yield db.NewsComments.getComment(createdComment.id);

  sockets('commentNews', response);
  res.send(response);
});

module.exports.likeNews = coroutine(function*(req, res) {
  const {news_id} = req.body;
  if (!news_id || !_.isNumber(news_id)) {
    return;
  }
  /* User like news */
  let likeNews = true;

  yield db.NewsLikes.findOrCreate({
    where: {
      news_id,
      user_id: req.user.id
    },
    defaults: {
      news_id,
      user_id: req.user.id
    }
  }).spread((row, created) => {
    if (!created) {
      const active = Number(row.dataValues.active);
      /* User dislike\like news */
      likeNews = Boolean(!active);
      return row.updateAttributes({active: !active});
    }
  });

  yield increaseOrDecreaseLikeCount(news_id, likeNews);
  sockets('likeNews', {news_id, likeNews});
  res.send({news_id, likeNews});
});

module.exports.getNewsCommment = coroutine(function*(req, res) {
  let comments = yield db.NewsComments.getNewsComment(req.params.id);

  res.send({comments});
});

module.exports.getNewsByFilter = coroutine(function*(req, res) {
  let {tags: name} = req.body;
  if (name && name.length && name.length > MAX_NEWS_TAGS) {
    return res.send({error: 'No or to much tags'});
  }

  const news = yield db.News.findAll({
    where: {
      published: 1
    },
    include: [
      {
        model: db.Tags,
        where: {
          name
        },
        through: {
          attributes: []
        },
        as: 'tags',
        attributes: ['name']
      }
    ],
    limit: 10,
    attributes: ['id', 'title', 'content', 'created_at', 'like_count', 'share_count', 'views_count', 'comment_count'],
    order: 'id DESC'
  });

  res.send({news})
});

module.exports.getSingleNewsById = coroutine(function*(req, res) {
  const news = yield db.News.getSingleNews(req.params.id);

  if (news) {
    news.increment('views_count');
    sockets('viewNews', news.id);
    yield news.reload();
  }

  res.send({news});
});

module.exports.getUserNews = coroutine(function*(req, res) {
  let {id} = req.params;
  id = parseInt(_.escape(id));
  if (_.isNaN(id)) {
    // TODO: send error
    return;
  }

  const news = yield db.News.getAllPublishedNewsAuthor(id, false);

  res.send({news});
});

module.exports.uploadImage = coroutine(function*(req, res) {
  if (!req.file || req.file.size > 1024 * 500) {
    return res.status(403).send({message: 'Size higher then 500kb'});
  }
  let type = req.file.mimetype.match(/\/+(.*)/);

  if (type && ['png', 'jpg', 'jpeg', 'gif'].indexOf(type[1].toLowerCase()) === -1) {
    return res.status(403).send({message: 'Wrong file type, only PNG/JPG allowed'});
  }

  let data = req.file.buffer;

  let name = `${shortid.generate()}${type ? `.${type[1]}` : '.png'}`;
  yield fs.writeFileAsync(`${dirname}/server/storage/image/${name}`, data);

  res.send(`http://${server.host}:${server.port}/storage/image/${name}`);
});
