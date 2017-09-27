import * as Vue from 'vue'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'
import {News} from "../../../interface/News";
import api from "../../../api";
import {User} from "../../../interface/User";

@Component({
  template: require('./stats.view.html'),
  props: ['id'],
  computed: {
    ...mapGetters([
      'user',
      'game'
    ])
  },
  filters: {
    winRate: function(value) {
      let winRate = value.win / value.games * 100;
      return isNaN(winRate) ? "0.00" : winRate.toFixed(2);
    }
  }
})

export default class StatsView extends Vue {
  public id: number;
  public game: any;
  public user: User;
  public profile: User = null;
  public news: Array<News>;
  public stats: any = null;
  public heroStats: any = null;

  public async mounted(): Promise<void> {
    let id = this.id;
    this.profile = (<any>this).$parent.$parent.profile;

    switch (this.game.id) {
      case 1:
        this.stats = this.profile.UserDotaStat;
        break;
    }

    this.heroStats = await api.updateUserHeroStats(this.profile.id).then((res: any) => {
      return res.body.heroes
    });
  }
}
