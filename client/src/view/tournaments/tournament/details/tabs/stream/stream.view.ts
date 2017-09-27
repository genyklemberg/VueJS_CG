import * as Vue from "vue";
import Component from "vue-class-component";

@Component({
  template: require('./stream.view.html'),
  props: ['tournament']
})
export default class Stream extends Vue {



}
