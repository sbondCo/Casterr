import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Recordings from "./views/Recordings.vue";
import Settings from "./views/Settings.vue";
import VideoPlayer from "./views/VideoPlayer.vue";
import DesktopNotification from "./views/DesktopNotification.vue";

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
  },
  {
    path: "/videoPlayer/:videoPath",
    name: "videoPlayer",
    component: VideoPlayer,
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
