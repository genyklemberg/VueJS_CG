import api from '../api';
import {types} from './types';
import {TournamentKey} from "../view/tournaments/tournament-key";

// initial state
const state = {
  matches: {
    current: [],
    future: []
  },
  tournament: [],
  tournamentById: {}
};

// getters
const getters = {
  matches: state => state.matches,
  tournament: state => state.tournament
};

// actions
const actions = {
  currentMatches ({dispatch, commit}): Promise<void> {
    return api.getCurrentMatches().then((res: any): void => {
      commit(types.MATCHES_CURRENT, res.body);
    });
  },
  futureMatches ({dispatch, commit}): Promise<void> {
    return api.getFutureMatches().then((res: any): void => {
      commit(types.MATCHES_FUTURE, res.body);
    });
  },
  updateTournament ({dispatch, commit}, tournamentKey: TournamentKey): Promise<void> {
    return api.getTournament(tournamentKey).then((res: any): void => {
      commit(types.TOURNAMENT, res.body);
    });
  }
};

// mutations
const mutations = {
  [types.MATCHES_CURRENT] (state, current) {
    state.matches.current = current;
  },
  [types.MATCHES_FUTURE] (state, future) {
    state.matches.future = future;
  },
  [types.TOURNAMENT] (state, tournament) {
    state.tournament = tournament.list;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
