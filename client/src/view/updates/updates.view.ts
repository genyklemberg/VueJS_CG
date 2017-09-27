import * as Vue from 'vue'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'

@Component(<any>{
  template: require('./updates.view.html'),
  computed: {
    ...mapGetters([
      'notifications'
    ])
  },
})

export default class UpdatesView extends Vue {

  public mounted(): void {
    this.$store.dispatch('updateUserNotification');
  }

  private handleOpen(item: any) {
    this.$router.push(`/user/${item.author.id}`);
  }

  private acceptFriendInvite(id: number) {
    this.$store.dispatch('acceptFriendInvite', id)
  }

  private acceptTeamInvite(id: number) {
    this.$store.dispatch('acceptTeamInvite', id)
  }

}
