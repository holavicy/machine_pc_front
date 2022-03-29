import Vue from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.less";
import * as api from "./api";
import "../public/css/global.css";

Vue.config.productionTip = false;

Vue.prototype.$api = api.default;

Vue.use(Antd);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
