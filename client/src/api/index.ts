import {
  UserResource,
  SystemResource,
  NewsResource,
  FriendsResource,
  TeamResource,
  MatchesResource
} from '../core/resource'
import {TournamentKey} from "../view/tournaments/tournament-key";

export default {
  /* System resources */
  getGames: function (): Promise<any> {
    return SystemResource.get({entity: 'games'})
  },
  getLocalization: function (id): Promise<any> {
    return SystemResource.get({entity: 'localization', id})
  },
  searchTags: function (query: string): Promise<any> {
    return SystemResource.get({action: 'tags', query})
  },

  /* Matches */
  getCurrentMatches: function () {
    return MatchesResource.get({entity: 'current'});
  },
  getFutureMatches: function () {
    return MatchesResource.get({entity: 'future'});
  },

  /* Tournaments */
  getTournament: function (tournamentKey: TournamentKey) {
    return MatchesResource.get({entity: 'tournaments', id: tournamentKey});
  },
  getTournamentById: function (id: number) {
    return MatchesResource.get({entity: 'tournaments', action: 'information', id});
  },

  /* User resources */
  getLogout: function (): Promise<any> {
    return UserResource.get({entity: 'logout'})
  },
  postRegistration: function (data: any): Promise<any> {
    return UserResource.save({action: 'registration'}, data)
  },
  postLogin: function (data: any): Promise<any> {
    return UserResource.save({action: 'login'}, data)
  },
  getUser: function (id?: number): Promise<any> {
    return UserResource.get({id})
  },
  getToken: function (): Promise<any> {
    return UserResource.get({action: 'token'})
  },
  postConfirm: function (data: any): Promise<any> {
    return UserResource.save({action: 'confirm'}, data)
  },
  emailConfirm: function (key: any): Promise<any> {
    return UserResource.get({entity: 'email-confirm', key})
  },
  getUserNews: function (id: number): Promise<any> {
    return NewsResource.get({entity: 'user', id})
  },
  searchUserByName: function (name: string): Promise<any> {
    return UserResource.get({action: 'search', name})
  },
  getUserNotification: function (): Promise<any> {
    return UserResource.get({action: 'notifications'})
  },
  getUserNotificationCount: function (): Promise<any> {
    return UserResource.get({entity: 'notifications', action: 'count'})
  },
  uploadUserAvatar: function (data: any): Promise<any> {
    return UserResource.save({action: 'avatar'}, data)
  },
  editUser: function (data: any): Promise<any> {
    return UserResource.save({}, data)
  },
  dataConfirm: function (key: any): Promise<any> {
    return UserResource.get({entity: 'data-confirm', key})
  },
  updateUserStats: function (): Promise<any> {
    return UserResource.save({action: 'update-stats'}, {})
  },
  updateUserHeroStats: function (id: number): Promise<any> {
    return UserResource.get({id, action: 'dota'}, {})
  },
  getUserByFilter: function (query: any): Promise<any> {
    return UserResource.get({action: 'filter', ...query})
  },

  /* Friends resources */
  getUserFriends: function (id: number): Promise<any> {
    return FriendsResource.get({entity: 'user', id})
  },
  addUserFriend: function (user_id: number): Promise<any> {
    return FriendsResource.save({action: 'request'}, {user_id})
  },
  removeUserFriend: function (friend_id: number): Promise<any> {
    return FriendsResource.save({action: 'remove'}, {friend_id})
  },
  acceptFriendInvite: function (request_id: number): Promise<any> {
    return FriendsResource.save({action: 'confirm'}, {request_id})
  },

  /* Team resources */
  getTeam: function (id: number): Promise<any> {
    return TeamResource.get({id})
  },
  createTeam: function (data: any): Promise<any> {
    return TeamResource.save({action: 'create'}, data)
  },
  teamUserInvite: function (data: any): Promise<any> {
    return TeamResource.save({action: 'invite'}, data)
  },
  teamUserRemove: function (user_id: any): Promise<any> {
    return TeamResource.save({action: 'remove'}, {user_id})
  },
  editTeam: function (data: any): Promise<any> {
    return TeamResource.save({}, data)
  },
  acceptTeamInvite: function (request_id: number): Promise<any> {
    return TeamResource.save({action: 'confirm'}, {request_id})
  },
  uploadTeamAvatar: function (data: any): Promise<any> {
    return TeamResource.save({action: 'avatar'}, data)
  },
  editTeamMate: function (data: any): Promise<any> {
    return TeamResource.save({entity: 'mate'}, data)
  },

  /* News resources */
  getNews: function (news_id?: number): Promise<any> {
    return NewsResource.get({entity: news_id})
  },
  getNewsComments: function (news_id?: number): Promise<any> {
    return NewsResource.get({entity: news_id, id: 'comment'})
  },
  addNewsComment: function (data: any): Promise<any> {
    return NewsResource.save({entity: 'comment'}, data)
  },
  addNews: function (data: any): Promise<any> {
    return NewsResource.save({action: 'add'}, data)
  },
  likeNews: function (news_id: number): Promise<any> {
    return NewsResource.save({action: 'like'}, {news_id})
  },
  shareNews: function (news_id: number): Promise<any> {
    return NewsResource.save({action: 'share'}, {news_id})
  },
  uploadNewsImage: function (data: FormData): Promise<any> {
    return NewsResource.save({action: 'image'}, data)
  }
}
