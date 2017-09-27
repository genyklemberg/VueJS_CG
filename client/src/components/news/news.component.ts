import * as Vue from 'vue';
import * as sanitizeHtml from 'sanitize-html';
import * as _ from 'lodash';
import Component from 'vue-class-component';
import {mapGetters} from 'vuex';
import {News} from "../../interface/News";
import api from "../../api";

const chapter = {
  title: '',
  content: '',
  cover: false
};

@Component(<any>{
  template: require('./news.component.html'),
  props: ['data', 'create'],
  computed: {
    ...mapGetters([
      'authenticated',
      'games',
      'game'
    ])
  },
  filters: {
    cover: function (chaptersJson: any, part: string) {
      let news = JSON.parse(chaptersJson);
      let cover: any = _.find(news, {cover : true});
      switch(part) {
        case 'preview':
          let parser = new DOMParser();
          let body = parser.parseFromString(cover.content, "text/html");
          let images = body.getElementsByTagName('img');
          return images.length > 0 ? images[0].src : '';
        case 'content':
          return sanitizeHtml(cover.content, {allowedTags: []}).slice(0, 120) + '...';
        default:
          return cover[part];
      }
    },
  }
})

export default class NewsComponent extends Vue {
  public data: Array<News>;
  public authenticated: boolean;
  public create: boolean;
  public game: any;
  private form: any = {
    content: '',
    title: '',
    tags: [],
    game_id: null,
    chapters: [
      _.clone(chapter)
    ]
  };
  public tags: any = {
    data: [],
    loading: false
  };
  private editorVisible: boolean = false;
  private editorOption: any = {
    modules: {
      clipboard: {
        matchVisual: false
      },
      toolbar: [
        ['image', 'video'],
        ['bold', 'italic', 'underline'],
        [{'list': 'bullet'}, 'link'],
      ],
      history: {
        delay: 1000,
        maxStack: 50,
        userOnly: false
      },
      imageImport: true,
      imageResize: {
        displaySize: true
      }
    }
  };

  public handleCreate(chapters?: boolean): void {
    const chaptersContent = _.map(this.form.chapters, 'content');
    if(chapters && !chaptersContent.join())
      (<any>this).$message.danger({message: 'Chapters are empty'});
    else
      this.$store.dispatch('createNews', {...this.form, game_id: this.form.game_id ? this.form.gain : this.game.id}).then(() => {
        this.form = {
          content: '',
          title: '',
          tags: [],
          game_id: null,
          chapters: [
            _.clone(chapter)
          ]
        };
        this.editorVisible = false;
      });
  }

  public handleLike(id: number): void {
    this.$store.dispatch('likeNews', id);
  }

  public handleShare(id: number): void {
    this.$store.dispatch('shareNews', id);
  }

  public handleOpen(id: number): void {
    this.$router.push(`/news/${id}`);
  }

  public addChapter(): void {
    this.form.chapters.push(_.clone(chapter))
  }

  private handleClose(done: Function) {
    (<any>this).$confirm('Are you sure you want stop editing?')
      .then(_ => {
        done();
      })
      .catch(_ => {
      });
  }

  private imageHandler(image) {
    let data = new FormData();
    data.append('image', image, image.name);
    return api.uploadNewsImage(data).then((res) => {
      return res.body
    })
  }

  private handleEditorInit(index: any) {
    const upload = this.imageHandler;
    let quill: any = (<any>this).$refs.editor[index].quill;
    if (quill) {
      quill.getModule('toolbar').addHandler('image', function () {
        let fileInput = (<any>this).container.querySelector('input.ql-image[type=file]');
        if (fileInput == null) {
          fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.setAttribute('accept', 'image/*');
          fileInput.classList.add('ql-image');
          console.log(this);
          fileInput.addEventListener('change', async () => {
            if (fileInput.files != null && fileInput.files[0] != null) {
              let range = this.quill.getSelection(true);
              let index = range.index + range.length;
              let image = await upload(fileInput.files[0]);
              this.quill.insertEmbed(index, 'image', image);
            }
          });
          this.container.appendChild(fileInput);
        }
        fileInput.click();
      });
    }
  }

  private handleCommand(command: string) {
    switch (command) {
      case 'create':
        this.editorVisible = true;
        break;
    }
  }

  private async handleTagsSearch(query: string): Promise<void> {
    this.tags.loading = true;
    let tags = await api.searchTags(query).then((res: any) => {
      return res.body.tags
    });
    let data = {...this.form.tags, ...tags};
    this.tags = {...this.tags, data};
    this.tags.loading = false;
  }

}
