import * as Vue from 'vue';
import Component from 'vue-class-component';
import {mapGetters} from "vuex";
import {TournamentKey} from "./tournament-key";
import moment from "moment";

@Component({
  template: require('./tournaments.view.html'),
  computed: {
    ...mapGetters([
      'tournament'
    ])
  }
})
export default class TournamentsView extends Vue {
  public TournamentKey: any = TournamentKey;
  public loading: boolean = false;
  public tournamentOptions: any = {
    ongoing: 'Actual',
    upcoming: 'Upcoming',
    past: 'Past'
  };

  public activeButton: TournamentKey = TournamentKey.ONGOING;

  public mounted (): void {
    this.handleChangeActiveButton();
  }

   public getTournamentDate(date: number): string {
     console.log(date)
     return moment(date * 1000).fromNow();
   }

  public async handleChangeActiveButton (): Promise<void> {
    this.loading = true;
    await this.$store.dispatch('updateTournament', this.activeButton);
    this.loading = false;
  }
}
