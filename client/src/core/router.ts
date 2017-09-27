import {VueRouter} from './vue'
import routes from './routes'
import api from '../api'
import {store} from './index'
import {types} from "../store/types";

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes
});

function createCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date: any = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = `expires=${date.toGMTString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/; domain=${window.location.hostname}`;
}

router.beforeEach(async function (to, from, next) {
  if (to.matched.some(record => record.meta.requireAdmin)) {
    if (!store.getters.role)
      await store.dispatch('updateUser');

    if (store.getters.role !== 'admin') {
      next({path: '/'})
    }
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.authenticated)
      await store.dispatch('updateUser');

    if (!store.getters.authenticated) {
      next({path: '/'})
    }
  }
  if (to.matched.some(record => record.meta.affiliate)) {
    createCookie('affiliate-code', to.params.code, 7);
    next({path: '/'})
  }
  if (to.matched.some(record => record.meta.emailConfirm)) {
    api.emailConfirm(to.query.key).then(() => {
      (<any>store).commit(types.USER_DATA_UPDATE, {confirmed: 1});
      next({path: '/'})
    })
  }
  if (to.matched.some(record => record.meta.dataConfirm)) {
    api.dataConfirm(to.query.key).then(() => {
      (<any>store).dispatch('updateUser');
      next({path: '/'})
    })
  }
  next();
});

export default router
