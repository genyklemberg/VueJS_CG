import * as Vue from "vue";
import Component from "vue-class-component";
import moment from "moment";

@Component({
  template: require('./about.view.html'),
  props: ['tournament']
})
export default class About extends Vue {
  private tournament: any;

  public getTournamentDate(): any {
    return moment(this.tournament.start * 1000).fromNow();
  }
}
