import * as Vue from 'vue'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'
import {News} from "../../../interface/News";
import api from "../../../api";
import {User} from "../../../interface/User";

@Component({
  template: require('./feed.view.html'),
  props: ['id'],
  computed: {
    ...mapGetters([
      'user',
      'news'
    ])
  }
})

export default class FeedView extends Vue {
  public id: number;
  public user: User;
  public profile: User;
  public news: Array<News>;

  public async mounted(): Promise<void> {
    this.$store.dispatch('getUserNews', this.id);
  }

}
