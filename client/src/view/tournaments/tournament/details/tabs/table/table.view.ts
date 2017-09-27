import * as Vue from "vue";
import Component from "vue-class-component";

@Component({
  template: require('./table.view.html'),
  props: ['tournament']
})
export default class Table extends Vue {
  public activeName: string = 'first';

  handleClick(tab, event) {
    console.log(tab, event);
  }

  mounted() {
    // $('#tournament-about-list').bracket({
    //   init: this.tournament.stages
    // })
  }


}
