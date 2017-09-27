import * as Vue from 'vue'
import * as _ from 'lodash'
import Component from 'vue-class-component'
import {mapGetters} from 'vuex'
import api from "../../../api";
import {User} from "../../../interface/User";
import {Team} from "../../../interface/Team";

@Component({
  template: require('./team.view.html'),
  props: ['id'],
  computed: {
    ...(mapGetters([
      'user',
      'team',
      'game'
    ])),
    accessManage(component: any) {
      let user: any = _.find(this.team.users, {id: this.user.id});
      return user ? user.TeamUser.manage : false;
    },
    accessEdit(component: any) {
      let user: any = _.find(this.team.users, {id: this.user.id});
      return user ? user.TeamUser.edit : false;
    }
  }
})

export default class UserTeamView extends Vue {
  public id: number;
  public user: User;
  public team: Team;
  public game: any;
  private teamForm: any = {
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
  private tags: any = {
    data: [],
    loading: false
  };
  private teamMate: any = {
    data: {
      manage: false,
      edit: false,
      posting: false
    },
    rules: {
      name: [
        {validator: this.validateTeamName, trigger: 'blur'}
      ]
    },
    progress: false
  };
  private teamInviteForm: any = {
    data: {
      user_id: null
    },
    rules: {
      user_id: [
        {validator: this.validateUser, trigger: 'blur'}
      ]
    },
    progress: false
  };
  private modal: any = {
    edit: false,
    invite: false,
    editMate: false
  };

  public async created(): Promise<void> {
    if (this.user.team)
      await this.$store.dispatch('updateTeam', this.user.team.team_id);

    if(this.team)
      this.teamForm.data.name = this.team.name;
  }

  private handleTeamTagsSearch(): void {

  }

  private handleUserSelect(item: any) {
    this.teamInviteForm.data.user_id = item.id;
    (<any>this).$refs.teamInvite.validate();
  }

  private handleInvite(item: any) {
    (<any>this).$refs.teamInvite.validate(async (valid) => {
      if (valid) {
        this.teamInviteForm.progress = true;
        this.teamInviteForm.data.team_id = this.team.id;
        await this.$store.dispatch('teamUserInvite', this.teamInviteForm.data).then((res: any) => {
          (<any>this).$message({
            message: res.success,
            type: 'success'
          });
        });
        this.teamInviteForm.progress = false;
        this.modal.invite = false;
      }
    });
  }

  private handleOpen(item: any) {
    this.$router.push(`/user/${item.id}`);
  }

  private removeMate(user_id: any) {
    this.$store.dispatch('teamUserKick', {id: this.team.id, user_id}).then((res: any) => {
      (<any>this).$message({
        message: res.success,
        type: 'success'
      });
    });
  }

  private handleTeamCreate(): void {
    (<any>this).$refs.teamCreate.validate(async (valid) => {
      if (valid) {
        this.teamForm.data.game_id = this.game.id;
        this.teamForm.progress = true;
        await this.$store.dispatch('createTeam', this.teamForm.data);
        this.teamForm.progress = false;
      }
    });
  }

  private handleEdit(): void {
    (<any>this).$refs.teamEdit.validate(async (valid) => {
      if (valid) {
        this.teamForm.data.id = this.team.id;
        this.teamForm.progress = true;
        await this.$store.dispatch('editTeam', this.teamForm.data);
        this.teamForm.progress = false;
        this.modal.edit = false;
        (<any>this).$message({
          message: 'Team edited',
          type: 'success'
        });
      }
    });
  }

  private validateTeamName(rule, value, callback): void {
    if (this.teamForm.data.name === '') {
      callback(new Error('Type team name'));
    } else {
      callback();
    }
  }

  private validateUser(rule, value, callback): void {
    if (this.teamInviteForm.data.user_id === null) {
      callback(new Error('Select user'));
    } else {
      callback();
    }
  }

  private handleMateOpen(id: number): void {
    this.modal.editMate = true;
    let user: any = _.find(this.team.users, {id});
    if(user) {
      let access = user.TeamUser;
      this.teamMate.data.id = id;
      this.teamMate.data.manage = !!access.manage;
      this.teamMate.data.edit = !!access.edit;
      this.teamMate.data.posting = !!access.posting;
    }
  }

  private handleMateEdit(): void {
    this.$store.dispatch('editTeamMate', {...this.teamMate.data, team_id: this.team.id}).then((res: any)=> {
      this.modal.editMate = false;
      (<any>this).$message({
        message: res.success,
        type: 'success'
      });
    });
  }

  private uploadAvatar(request: any): void {
    if (request.file.size > 204800)
      return (<any>this).$message({
        message: 'Max. image size 200kb',
        type: 'warning'
      });


    let data = new FormData();
    data.append('avatar', request.file, request.file.name);
    data.append('team_id', String(this.team.id));

    api.uploadTeamAvatar(data).then((res: any) => {
      this.$store.commit('TEAM_AVATAR_UPDATE', res.body.name)
    })
  }

}
