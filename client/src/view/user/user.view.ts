import * as Vue from 'vue'
import * as _ from 'lodash'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'
import api from "../../api";
import {News} from "../../interface/News";
import {User} from "../../interface/User";

@Component({
  template: require('./user.view.html'),
  props: ['id'],
  computed: {
    ...mapGetters([
      'news',
      'user'
    ])
  },
  watch: {
    $route: function(res) {
      (<any>this).updateProfile()
    }
  }
})

export default class UserView extends Vue {
  public profile: User = null;
  public user: User;
  public news: Array<News>;
  public tags: any = {
    data: [],
    loading: false
  };
  private modal: any = {
    edit: false
  };
  private userForm: any = {
    data: {
      name: ''
    },
    rules: {
      name: [
        {validator: this.validateTeamName, trigger: 'blur'}
      ]
    },
    progress: false
  };

  public mounted(): void {
    this.updateProfile()
  }

  public async updateProfile(force?: boolean): Promise<void> {
    let id = Number(this.$route.params.id);
    if(!id)
      id = this.user.id;

    if(!this.profile || this.profile.id !== id || force)
      this.profile = await api.getUser(id).then((res: any) => {
        return res.body.user
      });
  }

  private validateTeamName(rule, value, callback): void {
    if (this.userForm.data.name === '') {
      callback(new Error('Type your name'));
    } else {
      callback();
    }
  }

  private uploadAvatar(request: any): void {
    if (request.file.size > 204800)
      return (<any>this).$message({
        message: 'Max. image size 200kb',
        type: 'warning'
      });

    let data = new FormData();
    data.append('avatar', request.file, request.file.name);

    api.uploadUserAvatar(data).then((res: any) => {
      this.$store.commit('USER_AVATAR_UPDATE', res.body.name);
      if(this.profile.id === this.user.id)
        this.profile.avatar = res.body.name;
    })
  }

  private handleEdit(): void {
    (<any>this).$refs.userEdit.validate(async (valid) => {
      if (valid) {
        this.userForm.progress = true;
        await this.$store.dispatch('editUser', this.userForm.data);
        this.updateProfile(true);
        this.userForm.progress = false;
        this.modal.edit = false;
        (<any>this).$message({
          message: 'Profile edited',
          type: 'success'
        });
      }
    });
  }

  private handleOpenEdit(): void {
    this.modal.edit = true;
    this.userForm.data.name = this.user.name;
    this.userForm.data.email = this.user.email;
    this.$set(this.userForm.data, 'tags', _.map(this.user.tags, 'id'));
    this.tags = {...this.tags, data: this.user.tags};
  }

  private refreshStats(): void {
    this.$store.dispatch('updateStats', this.userForm.data).then(() => {
      (<any>this).$message({
        message: 'Stats refreshed',
        type: 'success'
      });
    });
  }

  private async handleTagsSearch(query: string): Promise<void> {
    this.tags.loading = true;
    let tags = await api.searchTags(query).then((res: any) => {
      return res.body.tags
    });
    let data = {...this.user.tags, ...tags};
    this.tags = {...this.tags, data};
    this.tags.loading = false;
  }

}
