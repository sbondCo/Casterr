import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Videos from "./views/Videos.vue";
import Settings from "./views/Settings.vue";
import VideoEditor from "./views/VideoEditor.vue";
import DesktopNotification from "./views/DesktopNotification.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/videos",
    name: "videos",
    component: Videos
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  },
  {
    path: "/videoEditor/:video",
    name: "videoEditor",
    component: VideoEditor,
    props: true
  },
  {
    path: "/desktopNotification/:desc/:icon?",
    name: "desktopNotification",
    component: DesktopNotification,
    props: true,
    meta: {
      layout: "BlankLayout"
    }
  }
];

const router = new VueRouter({
  mode: "hash",
  routes
});

export default router;
