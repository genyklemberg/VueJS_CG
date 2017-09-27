import * as Vue from 'vue'
import Component from 'vue-class-component'
import api from "../../api"
import {News} from "../../interface/News";
import * as sanitizeHtml from 'sanitize-html';
import * as _ from 'lodash';

@Component(<any>{
  template: require('./news.view.html'),
  props: ['id'],
  socket: {
    events: {
      likeNews: function (data: any) {
        if (this.id == data.news_id && this.news)
          data.likeNews ? this.news.like_count++ : this.news.like_count--;
      },
      shareNews: function (news_id: number) {
        if (this.id == news_id && this.news)
          this.news.share_count++;
      },
      viewNews: function (news_id: number) {
        if (this.id == news_id && this.news)
          this.news.views_count++;
      },
      commentNews: function (comment: any) {
        if (this.id == comment.news_id && this.news) {
          this.comments.push(comment);
          this.news.comment_count++;
        }
      }
    }
  },
  filters: {
    chaptersTitle: function (chaptersJson: any) {
      let chapters = JSON.parse(chaptersJson);
      return _.map(chapters, 'title');
    },
    chapters: function (chaptersJson: any) {
      let chapters = JSON.parse(chaptersJson);
      return chapters;
    },
  }
})

export default class NewsView extends Vue {
  public id: number;
  private news: News = null;
  private comments: Array<any> = [];
  private form: any = {};
  private chapters: Array<any> = [];

  public async mounted(): Promise<void> {
    this.news = await api.getNews(this.id).then((res: any) => {
      return res.body.news;
    });

    if (!this.news)
      return this.$router.push(`/`);

    this.comments = await api.getNewsComments(this.id).then((res: any) => {
      return res.body.comments;
    });
  }

  public async handleComment(): Promise<void> {
    this.form.news_id = this.id;
    api.addNewsComment(this.form).then(() => {
      this.form = {};
    });
  }

  public handleLike(id: number): void {
    this.$store.dispatch('likeNews', id);
  }

  public handleShare(id: number): void {
    this.$store.dispatch('shareNews', id);
  }

}
