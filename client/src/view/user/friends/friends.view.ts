import * as Vue from 'vue'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'
import {User} from "../../../interface/User";

@Component({
  template: require('./friends.view.html'),
  props: ['id'],
  computed: {
    ...mapGetters([
      'user',
      'friends'
    ])
  }
})

export default class FriendsView extends Vue {
  public id: number;
  public user: User;
  public friends: Array<any>;

  public async created(): Promise<void> {
    this.$store.dispatch('updateFriends');
  }

  handleOpen(item: any) {
    this.$router.push(`/user/${item.friend.id}`);
  }

  removeFriend(item: any) {
    this.$store.dispatch('removeUserFriend', item).then((res: any) => {
      (<any>this).$message({
        message: res.success,
        type: 'success'
      });
    });
  }

}
