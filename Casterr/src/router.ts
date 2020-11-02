import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Recordings from "./views/Recordings.vue";
import Settings from "./views/Settings.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/recordings",
    name: "recordings",
    component: Recordings
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  }
];

const router = new VueRouter({
  routes,
  mode: "hash"
});

export default router;
