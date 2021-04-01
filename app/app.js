import Vue from "nativescript-vue";

import Home from "./components/Home";
import Store from "./components/Store";

const appSettings = require("tns-core-modules/application-settings");
const token = appSettings.getString("token");

import { ModalStack, overrideModalViewMethod, VueWindowedModal } from './nativescript-windowed-modal';
overrideModalViewMethod();

Vue.registerElement('ModalStack', () => ModalStack);
Vue.use(VueWindowedModal);

new Vue({
    render: h => h('frame', [h(token ? Store : Home)]),
}).$start();
