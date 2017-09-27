import * as Vue from 'vue';
import Component from 'vue-class-component';
import {mapGetters} from 'vuex';

@Component(<any>{
  template: require('./widget-matches.component.html'),
  computed: {
    ...mapGetters([
      'matches'
    ])
  }
})

export default class WidgetMatchesComponent extends Vue {
  public matches: any;
  private loading: boolean = false;
  private activeTab: string = 'current';

  public async created(): Promise<void> {
    this.handleSwitch();
  }

  public async handleSwitch(): Promise<void> {
    this.loading = true;
    await this.$store.dispatch(`${this.activeTab}Matches`);
    this.loading = false;
  }
}
