/* View components */
import HomeView from "../view/home/home.view";
import NewsView from "../view/news/news.view";
import TournamentsView from "../view/tournaments/tournaments.view";
import UserView from "../view/user/user.view";
import ProfileView from "../view/user/profile/profile.view";
import FriendsView from "../view/user/friends/friends.view";
import UserTeamView from "../view/user/team/team.view";
import UpdatesView from "../view/updates/updates.view";
import FeedView from "../view/user/feed/feed.view";
import InfoView from "../view/user/info/info.view";
import StatsView from "../view/user/stats/stats.view";
import TournamentDetailsView from "../view/tournaments/tournament/details/tournament-details.view";
import About from "../view/tournaments/tournament/details/tabs/about/about.view";
import Table from "../view/tournaments/tournament/details/tabs/table/table.view";
import Fund from "../view/tournaments/tournament/details/tabs/fund/fund.view";
import SearchView from "../view/search/filter.view";
import Stream from "../view/tournaments/tournament/details/tabs/stream/stream.view";

declare const require: any;

export default [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/search/user/:id',
    component: SearchView
  },
  {
    path: '/news/:id',
    props: true,
    component: NewsView
  },
  {
    path: '/user',
    component: UserView,
    children: [
      {
        path: 'friends',
        component: FriendsView,
        meta: {requiresAuth: true}
      },
      {
        path: 'team',
        component: UserTeamView,
        meta: {requiresAuth: true}
      },
      {
        path: ':id',
        props: true,
        component: ProfileView,
        children: [
          {
            path: '',
            props: true,
            component: FeedView
          },
          {
            path: 'info',
            props: true,
            component: InfoView
          },
          {
            path: 'stats',
            props: true,
            component: StatsView
          }
        ]
      },
      {
        path: '',
        component: ProfileView
      },
    ]
  },
  {
    path: '/email-confirm',
    props: true,
    meta: {emailConfirm: true}
  },
  {
    path: '/tournaments',
    component: TournamentsView
  },
  {
    path: '/tournament/:id',
    props: true,
    component: TournamentDetailsView,
    children: [
      {
        path: 'about',
        props: true,
        component: About
      },
      {
        path: 'table',
        props: true,
        component: Table
      },
      {
        path: 'fund',
        props: true,
        component: Fund
      },
      {
        path: 'stream',
        props: true,
        component: Stream
      },
    ]
  },
  {
    path: '/updates',
    component: UpdatesView,
    meta: {requiresAuth: true}
  },
  {
    path: '/data-confirm',
    props: true,
    meta: {dataConfirm: true}
  },
]
