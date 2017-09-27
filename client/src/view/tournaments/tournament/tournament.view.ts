import * as Vue from 'vue';
import Component from 'vue-class-component';
import { mapGetters } from "vuex";
import moment from "moment";
import {TournamentKey} from "../tournament-key";

@Component({
  template: require('./tournament.view.html'),
  computed: {
    ...mapGetters([
      'tournament'
    ])
  }
})
export default class MatchesView extends Vue {
  public TournamentKey: any = TournamentKey;
  public tournamentOptions: any = {
    ongoing: 'Актуальные',
    upcoming: 'Будущие',
    past: 'Прошедшие'
  };

  public activeButton: TournamentKey = TournamentKey.ONGOING;

  public mounted (): void {
    this.$store.dispatch('updateTournament', this.activeButton);
  }

  public getTournamentDate(date: number): string {
    return moment(date * 1000).fromNow();
  }

  public handleGoToMatchClick(event):void {
    console.log(event);
  }

  public handleChangeActiveButton (): void {
    this.$store.dispatch('updateTournament', this.activeButton);
  }
}
