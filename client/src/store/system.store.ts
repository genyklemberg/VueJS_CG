import api from '../api'
import * as _ from 'lodash'
import {types} from './types'

// initial state
const state = {
  games: [],
  localization: {}
};

// getters
const getters = {
  games: state => _.map(state.games, (game: any) => { return {value: game.name, ...game}}),
  localization: state => state.localization,
  game: state => _.find(state.games, {selected: true})
};

// actions
const actions = {
  updateGames ({dispatch, commit}): Promise<void> {
    return api.getGames().then((res: any): void => {
      res.body.games[0].selected = true;
      commit(types.GAMES_DATA_UPDATE, res.body.games);
    });
  },
  updateLocalization ({dispatch, commit}, {locale}): Promise<void> {
    return api.getLocalization(locale).then((res: any): void => {
      commit(types.LOCALIZATION_DATA_UPDATE, res.body.localization);
    });
  },
};

// mutations
const mutations = {
  [types.GAMES_DATA_UPDATE] (state, games) {
    state.games = games;
  },
  [types.LOCALIZATION_DATA_UPDATE] (state, localization) {
    state.localization = localization;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
