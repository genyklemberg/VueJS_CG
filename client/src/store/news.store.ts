import api from '../api'
import * as _ from 'lodash'
import {types} from './types'

// initial state
const state = {
  news: []
};

// getters
const getters = {
  news: state => state.news
};

// actions
const actions = {
  updateNews ({dispatch, commit}): Promise<void> {
    commit(types.NEWS_DATA_UPDATE, []);
    return api.getNews().then((res: any): void => {
      commit(types.NEWS_DATA_UPDATE, res.body.news);
    });
  },
  getUserNews ({dispatch, commit, state}, user_id): Promise<void> {
    return api.getUserNews(user_id).then(async (res: any): Promise<void> => {
      commit(types.NEWS_DATA_UPDATE, res.body.news);
    });
  },
  createNews ({dispatch, commit}, data): Promise<void> {
    return api.addNews(data).then((res: any): void => {
      return res.body
    });
  },
  likeNews ({dispatch, commit}, news_id): Promise<void> {
    return api.likeNews(news_id).then((res: any): void => {
      return res.body
    });
  },
  shareNews ({dispatch, commit}, news_id): Promise<void> {
    return api.shareNews(news_id).then((res: any): void => {
      return res.body
    });
  },
};

// mutations
const mutations = {
  [types.NEWS_DATA_UPDATE] (state, news) {
    state.news = news;
  },
  [types.NEWS_SOCKETS_ADD] (state, news) {
    state.news.unshift(news);
  },
  [types.NEWS_SOCKETS_LIKE] (state, data) {
    let news: any = _.find(state.news, {id: data.news_id});
    if(news)
      data.likeNews ? news.like_count++ : news.like_count--;
  },
  [types.NEWS_SOCKETS_SHARE] (state, news_id) {
    let news: any = _.find(state.news, {id: news_id});
    if(news)
      news.share_count++
  },
  [types.NEWS_SOCKETS_VIEW] (state, news_id) {
    let news: any = _.find(state.news, {id: news_id});
    if(news)
      news.views_count++
  },
  [types.NEWS_SOCKETS_COMMENT] (state, news_id) {
    let news: any = _.find(state.news, {id: news_id});
    if(news)
      news.comment_count++
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}
