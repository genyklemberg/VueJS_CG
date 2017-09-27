import * as Vue from 'vue'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'
import {News} from "../../../interface/News";
import api from "../../../api";
import {User} from "../../../interface/User";

@Component({
  template: require('./profile.view.html'),
  props: ['id'],
  computed: {
    ...mapGetters([
      'user'
    ])
  }
})

export default class ProfileView extends Vue {
  public id: number;
  public user: User;
  public profile: User;

  mounted(): void {
    let id = this.id;

    if(!id)
      return this.$router.push(`/user/${this.user.id}`);
  }
}
