import * as Vue from "vue";
import Component from "vue-class-component";

@Component({
  template: require('./fund.view.html'),
  props: ['tournament']
})
export default class Fund extends Vue {

}
