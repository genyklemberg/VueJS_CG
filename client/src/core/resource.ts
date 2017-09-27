import {Vue} from './vue';
import {server} from "../../config.js";

(<any>Vue).http.options.root = `${location.protocol}//${server.host}:${location.protocol === 'https:' ? 443 : server.port}/api`;

export const UserResource = (<any>Vue).resource('user{/entity}{/id}{/action}');
export const SystemResource = (<any>Vue).resource('system{/entity}{/id}{/action}');
export const NewsResource = (<any>Vue).resource('news{/entity}{/id}{/action}');
export const FriendsResource = (<any>Vue).resource('friends{/entity}{/id}{/action}');
export const TeamResource = (<any>Vue).resource('team{/entity}{/id}{/action}');
export const MatchesResource = (<any>Vue).resource('matches{/entity}{/action}{/id}');
