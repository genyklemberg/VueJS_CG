import * as Vue from 'vue'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'
import {News} from "../../../interface/News";
import api from "../../../api";
import {User} from "../../../interface/User";

@Component({
  template: require('./info.view.html'),
  props: ['id'],
  computed: {
    ...mapGetters([
      'user'
    ])
  }
})

export default class InfoView extends Vue {
  public id: number;
  public user: User;
  public profile: User = null;
  public news: Array<News>;

  public async mounted(): Promise<void> {
    let id = this.id;
    this.profile = (<any>this).$parent.$parent.profile;
  }
}
