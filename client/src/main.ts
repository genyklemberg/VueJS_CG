import {Vue, router, store} from './core';

import './assets/scss/main.scss';
import App from './view/app.view';
import WidgetFriendsComponent from "./components/widget-friends/widget-friends.component";
import WidgetMatchesComponent from "./components/widget-matches/widget-matches.component";
import NewsComponent from "./components/news/news.component";
import UserSearchComponent from "./components/user-search/user-search.component";

/* Global components */
Vue.component('news', NewsComponent);
Vue.component('user-search', UserSearchComponent);
Vue.component('widget-matches', WidgetMatchesComponent);
Vue.component('widget-friends', WidgetFriendsComponent);

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
