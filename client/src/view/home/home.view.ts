import * as Vue from 'vue';
import Component from 'vue-class-component';
import {mapGetters} from 'vuex';
import {News} from '../../interface/News';

@Component({
  template: require('./home.view.html'),
  computed: {
    ...mapGetters([
      'news'
    ])
  }
})

export default class HomeView extends Vue {
  public news: Array<News>;

  public async beforeCreate(): Promise<void> {
    this.$store.dispatch('updateNews');
  }

}
