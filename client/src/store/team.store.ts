import api from "../api";
import {types} from "./types";
import {Team} from "../interface/Team";

// initial state
const state = {
  team: null
};

// getters
const getters = {
  team: state => state.team
};

// actions
const actions = {
  createTeam ({dispatch, commit}, data): Promise<void> {
    return api.createTeam(data).then((res: any): void => {
      dispatch('updateTeam', res.body.team.id);
    });
  },
  editTeam ({dispatch, commit}, data): Promise<void> {
    return api.editTeam(data).then((res: any): void => {
      dispatch('updateTeam', data.id);
    });
  },
  updateTeam ({dispatch, commit}, team_id): Promise<void> {
    return api.getTeam(team_id).then(async (res: any): Promise<void> => {
      commit(types.TEAM_DATA_UPDATE, res.body.team);
    });
  },
  teamUserInvite ({dispatch, commit}, data): Promise<void> {
    return api.teamUserInvite(data).then((res: any) => {
      return res.body
    });
  },
  teamUserKick ({dispatch, commit}, data): Promise<void> {
    return api.teamUserRemove(data.user_id).then((res: any) => {
      dispatch('updateTeam', data.id);
      return res.body
    });
  },
  acceptTeamInvite ({dispatch, commit}, request_id): Promise<void> {
    return api.acceptTeamInvite(request_id).then((res: any) => {
      dispatch('updateUserNotification');
      return res.body
    });
  },
  editTeamMate ({dispatch, commit}, data): Promise<void> {
    return api.editTeamMate(data).then((res: any) => {
      dispatch('updateTeam', data.team_id);
      return res.body
    });
  }
};

// mutations
const mutations = {
  [types.TEAM_DATA_UPDATE] (state, team: Team) {
    state.team = team;
  },
  [types.TEAM_AVATAR_UPDATE] (state, avatar: string) {
    state.team = {...state.team, avatar};
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
