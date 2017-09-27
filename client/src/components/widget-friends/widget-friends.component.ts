import * as Vue from 'vue'
import * as _ from 'lodash'
import Component from 'vue-class-component'
import api from '../../api'
import {mapGetters} from "vuex";
import {User} from "../../interface/User";

Vue.component('user-item', {
  functional: true,
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  render: function (h, ctx) {
    let item = ctx.props.item;
    return h('li', ctx.data, [
      h('img', { attrs: { class: item.avatar ? 'avatar' : '', src: item.avatar } }, []),
      h('span', { attrs: { class: 'name' } }, [item.name])
    ]);
  },
  props: {
    item: { type: Object, required: true }
  }
});

@Component(<any>{
  template: require('./widget-friends.component.html'),
  socket: {
    events: {
    }
  }
})

export default class WidgetFriendsComponent extends Vue {
  public user: User;
  public matches: Array<any>;
  private friendName: any = null;
  private searchTimeout: any;

  public async beforeCreate(): Promise<void> {
    //await this.$store.dispatch('updateMatches', {});
  }

  public handleFriendRequest(friend: any): void {
    this.$store.dispatch('addUserFriend', friend.id).then((res: any) => {
      (<any>this).$message({
        message: res.success,
        type: 'success'
      });
    });
  }

}
