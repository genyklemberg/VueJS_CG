import * as Vue from 'vue'
import Component from 'vue-class-component'
import api from '../../api';

@Component({
  template: require('./filter.view.html'),
  props: ['id']
})

export default class FilterView extends Vue {
  public users: any = [];

  async created() {
    try {
      const result =  await api.getUserByFilter({tag: this.$route.params.id});
      if (result.ok) {
        this.users = result.body.users;
        console.log(this.users);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
