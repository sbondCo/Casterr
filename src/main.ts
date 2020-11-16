import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import SettingsManager, { SettingsFiles, AppSettings, GeneralSettings } from "./libs/settings";

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
  // If startupPage setting is a page in the application, redirect to it
  // Else go to first page in AppSettings.pages setting
  if (AppSettings.pages.includes(GeneralSettings.startupPage)) {
    router.push(GeneralSettings.startupPage).catch(()=>{});
  }
  else router.push(AppSettings.pages[0]).catch(()=>{});
});
