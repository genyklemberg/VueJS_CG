import {Vuex} from './vue';
import session from '../store/session.store';
import user from '../store/user.store';
import system from '../store/system.store';
import news from '../store/news.store';
import team from '../store/team.store';
import matches from '../store/matches.store';

export default new Vuex.Store({
  modules: {session, user, system, news, team, matches},
  strict: true
});
