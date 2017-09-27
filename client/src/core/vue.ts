import * as Vue from 'vue'
import Vuex from 'vuex'
import * as VueRouter from 'vue-router'
import * as VueResource from 'vue-resource'
import * as Element from 'element-ui'
import VueMoment from 'vue-moment'
import Sockets from 'vue-websocket';
import ElementLang from 'element-ui/lib/locale/lang/en'
import ElementLocale from 'element-ui/lib/locale'
import VueQuillEditor from 'vue-quill-editor'
import VueScrollTo from 'vue-scrollto'
import {server} from "../../config.js"

/* Vue Plugins */
[VueResource, Vuex, VueRouter, Element, VueMoment, VueQuillEditor, VueScrollTo].forEach(Plugin => Vue.use(Plugin));
ElementLocale.use(ElementLang);

/* Sockets initiation */
(<any>Vue).use(Sockets, `${server.host}:${location.protocol === 'https:' ? 443 : server.port}`, {
  reconnection: true,
  forceNew: true,
  secure: location.protocol === 'https:'
});

/* Quill settings */
import Quill from 'quill'
import { ImageImport } from '../utils/quill/ImageImport.js'
import { ImageResize } from '../utils/quill/ImageResize.js'
Quill.register('modules/imageImport', ImageImport);
Quill.register('modules/imageResize', ImageResize);

export {Vue, VueRouter, Vuex, VueResource}
