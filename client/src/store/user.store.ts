import api from "../api";
import {types} from "./types";
import {User} from "../interface/User";

// initial state
const state = {
  user: <User>{},
  friends: [],
  notifications: [],
  notificationsCount: 0
};

// getters
const getters = {
  user: state => state.user,
  friends: state => state.friends,
  notifications: state => state.notifications,
  notificationsCount: state => state.notificationsCount,
};

// actions
const actions = {
  updateToken ({dispatch, commit}): Promise<void> {
    return api.getToken().then((res: any): void => {
      commit(types.TOKEN_UPDATED, res.body.token);
    });
  },
  updateUser ({dispatch, commit}): Promise<void> {
    return api.getUser().then(async (res: any): Promise<void> => {
      commit(types.USER_DATA_UPDATE, res.body.user);
      commit(types.SESSION_CHANGE, {authenticated: true});
      dispatch('updateUserNotificationCount');
    });
  },
  userLogout ({dispatch, commit}): Promise<void> {
    return api.getLogout().then(async (res: any): Promise<void> => {
      commit(types.USER_DATA_UPDATE, null);
      commit(types.SESSION_CHANGE, {authenticated: false});
    });
  },
  updateFriends ({dispatch, commit, state}): Promise<void> {
    return api.getUserFriends(state.user.id).then(async (res: any): Promise<void> => {
      commit(types.USER_FRIENDS_UPDATE, res.body.friends);
    });
  },
  addUserFriend ({dispatch, commit, state}, user_id): Promise<void> {
    return api.addUserFriend(user_id).then(async (res: any): Promise<void> => {
      dispatch('updateFriends');
      return res.body
    });
  },
  removeUserFriend ({dispatch, commit, state}, user_id): Promise<void> {
    return api.removeUserFriend(user_id).then(async (res: any): Promise<void> => {
      dispatch('updateFriends');
      return res.body
    });
  },
  updateUserNotificationCount ({dispatch, commit, state}): Promise<void> {
    return api.getUserNotificationCount().then((res: any): void => {
      commit(types.USER_NOTIFICATION_COUNT_UPDATE, res.body.notifyCount);
    });
  },
  updateUserNotification ({dispatch, commit, state}): Promise<void> {
    return api.getUserNotification().then((res: any): void => {
      commit(types.USER_NOTIFICATION_UPDATE, res.body);
      dispatch('updateUserNotificationCount');
    });
  },
  acceptFriendInvite ({dispatch, commit}, request_id): Promise<void> {
    return api.acceptFriendInvite(request_id).then((res: any) => {
      dispatch('updateUserNotification');
      return res.body
    });
  },
  editUser ({dispatch, commit}, data): Promise<void> {
    return api.editUser(data).then((res: any) => {
      dispatch('updateUser');
      return res.body
    });
  },
  updateStats ({dispatch, commit}): Promise<void> {
    return api.updateUserStats().then((res: any) => {
      commit(types.USER_STATS_UPDATE, res.body.user.manual_stats_update);
      return res.body
    });
  }
};

// mutations
const mutations = {
  [types.USER_DATA_UPDATE] (state, user: User) {
    state.user = user ? {...state.user, ...user} : {};
  },
  [types.TOKEN_UPDATED] (state, token: string) {
    state.user.token = token;
  },
  [types.USER_FRIENDS_UPDATE] (state, friends: any) {
    state.friends = friends;
  },
  [types.USER_NOTIFICATION_COUNT_UPDATE] (state, notifyCount: number) {
    state.notificationsCount = notifyCount;
  },
  [types.USER_NOTIFICATION_UPDATE] (state, notifications: Array<any>) {
    state.notifications = notifications;
  },
  [types.USER_AVATAR_UPDATE] (state, avatar: string) {
    state.user = {...state.user, avatar};
  },
  [types.USER_STATS_UPDATE] (state, manual_stats_update: string) {
    state.user = {...state.user, manual_stats_update};
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
