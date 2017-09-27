import * as Vue from 'vue'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'
import api from '../api';
import {News} from "../interface/News";
import {types} from "../store/types";
import {User} from '../interface/User';

@Component(<any>{
  template: require('./app.view.html'),
  computed: {
    ...mapGetters([
      'authenticated',
      'user',
      'games',
      'notificationsCount'
    ])
  },
  socket: {
    events: {
      connect () {
        console.info('Sockets: connected');
      },
      authenticated () {
        console.info('Sockets: authenticated');
      },
      unauthorized () {
        console.warn('Sockets: unauthorized');
      },
      disconnect () {
        console.warn('Sockets: disconnect');
      },
      balance (balance) {
        this.$store.commit('USER_BALANCE_CHANGE', balance);
      },
      online (online) {
        console.info(`Online: ${online}`);
      },
      addNews: function(news: News) {
        this.$store.commit(types.NEWS_SOCKETS_ADD, news)
      },
      likeNews: function(data: any) {
        this.$store.commit(types.NEWS_SOCKETS_LIKE, data)
      },
      shareNews: function(news_id: number) {
        this.$store.commit(types.NEWS_SOCKETS_SHARE, news_id)
      },
      viewNews: function(news_id: number) {
        this.$store.commit(types.NEWS_SOCKETS_VIEW, news_id)
      },
      commentNews: function (comment: any) {
        this.$store.commit(types.NEWS_SOCKETS_COMMENT, comment.news_id)
      }
    }
  }
})

export default class AppView extends Vue {
  public user: User;
  public authenticated: boolean;
  public games: Array<any>;
  public modal: any = {
    registration: false,
    login: false,
    confirm: false,
    form: {}
  };
  public game: string = "Dota 2";

  public async beforeCreate() {
    this.$store.dispatch('updateUser');
    await this.$store.dispatch('updateGames');
    await this.$store.dispatch('updateToken');
    await this.$store.dispatch('updateLocalization', {locale: 'en'});
    this.modal.confirm = !this.user.confirmed;
    (<any>this).$socket.emit('authenticate', {token: this.user.token});
    (<any>Vue).http.interceptors.push((request, next) => {
      next((response) => {
        switch (response.status) {
          case 200:
            if(response.body.error)
              (<any>this).$message({
                message: response.body.error,
                type: 'warning'
              });
            break;
          case 401:
            (<any>this).$message({
              message: 'Authorization required',
              type: 'warning'
            });
            break;
          case 403:
            (<any>this).$message({
              message: response.body.message,
              type: 'warning'
            });
        }
      });
    });
  }

  private handleCommand(command): void {
    switch (command) {
      case 'profile':
        this.$router.push(`/user/`); break;
      case 'exit':
        this.$store.dispatch('userLogout'); break;
    }
  }

  private handleConfirm(): void {
    api.postConfirm(this.modal.form).then(() => {
      this.modal.confirm = false;
      (<any>this).$message({
        type: 'success',
        message: 'We sent mail, check your email',
      })
    })
  }

  private handleLogin(): void {
    api.postLogin(this.modal.form).then((res: any) => {
      if(res.body.success) {
        this.$store.dispatch('updateUser');
        this.modal.login = false;
      }
    })
  }

  private handleRegistration(): void {
    api.postRegistration(this.modal.form).then(() => {
      this.modal.registration = false;
      (<any>this).$message({
        type: 'success',
        message: 'We sent mail, check your email',
      })
    })
  }

}
