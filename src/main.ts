import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import AppLayout from "./layouts/AppLayout.vue";
import SettingsManager, { SettingsFiles } from "./libs/settings";

// Create promises to complete before rendering app
// Currently only for gettings all of the user's settings
const promises = Object.values(SettingsFiles).map(s => {
  return SettingsManager.getSettings(s);
});

// After promises are all done, create app
Promise.all(promises).then(result => {
  Vue.config.productionTip = false;

  // Register AppLayout component
  Vue.component("AppLayout", AppLayout);

  new Vue({
    router,
    render: h => h(App),
  }).$mount("#app");
});
