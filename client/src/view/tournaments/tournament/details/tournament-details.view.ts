import * as Vue from "vue";
import api from "../../../../api";
import Component from "vue-class-component";

enum TournamentName {
  ABOUT = <any>'О турнире',
  TABLE = <any>'Таблица',
  FUND = <any>'Призовой фонд',
  MATCH = <any>'Матчи',
  RULES = <any>'Правила',
  STREAM = <any>'Стримы'
}

enum TournamentLink {
  ABOUT = <any>'/about',
  TABLE = <any>'/table',
  FUND = <any>'/fund',
  MATCH = <any>'/match',
  RULES = <any>'/rules',
  STREAM = <any>'/stream'
}

@Component({
  template: require('./tournament-details.view.html'),
  props: ['id']
})
export default class TournamentDetailsView extends Vue {
  public id: number;
  public tournament: any = {};
  public tournamentLinks: any = [
    {label: TournamentName.ABOUT, name: TournamentLink.ABOUT},
    {label: TournamentName.TABLE, name: TournamentLink.TABLE},
    {label: TournamentName.FUND, name: TournamentLink.FUND},
    {label: TournamentName.STREAM, name: TournamentLink.STREAM},
  ];

  public async mounted(): Promise<void> {
    const result: any = await api.getTournamentById(this.id);
    this.tournament = result.body;
  }

  public handleTournamentClick(e): void {
    console.log(11)
    this.$router.push(this.$route.path + e.name)
  }
}
