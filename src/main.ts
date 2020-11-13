import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import SettingsManager, { SettingsFiles } from "./ts/settings";

// Create promises to complete before rendering app
// Currently only for gettings all user settings
var promises = Object.values(SettingsFiles).map(s => {
  return SettingsManager.getSettings(s);
});

// After promises are all done, create app
Promise.all(promises).then(result => {
  Vue.config.productionTip = false;

  new Vue({
    router,
    render: h => h(App),
  }).$mount("#app");

  // Redirect to startup page defined in settings
  // router.push("recordings");
});
