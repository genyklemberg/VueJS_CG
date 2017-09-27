import {types} from "./types";
import {Session} from "../interface/Session";

// initial state
const state = {
  session: {authenticated: false}
};

// getters
const getters = {
  authenticated: state => state.session.authenticated
};

// actions
const actions = {
};

// mutations
const mutations = {
  [types.SESSION_CHANGE] (state, session: Session) {
    state.session = session;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
