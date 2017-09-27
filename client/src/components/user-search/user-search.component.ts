import * as Vue from 'vue'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'
import api from '../../api'

Vue.component('user-item', {
  functional: true,
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  render: function (h, ctx) {
    let item = ctx.props.item;
    return h('li', ctx.data, [
      h('img', { attrs: { class: item.avatar ? 'avatar' : '', src: `/storage/user/${item.avatar}` } }, []),
      h('span', { attrs: { class: 'name' } }, [item.name])
    ]);
  },
  props: {
    item: { type: Object, required: true }
  }
});

@Component(<any>{
  template: require('./user-search.component.html')
})

export default class UserSearchComponent extends Vue {
  private searchTimeout: any;
  private name: string = '';
  private resource: any;

  private handleSelect(item: any): void {
    this.name = item.name;
    this.$emit('select', item)
  }

  private handleSearch(query: string, cb: Function) {
    if (!query)
      return false;

    if (query.length < 2)
      return false;

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(async () => {
      let res = await this.searchAsync(query);
      cb(res);
    }, 500);
  }

  private searchAsync(name: string) {
    return api.searchUserByName(name).then((res) => {
      return res.body.users
    });
  }

}
