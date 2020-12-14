import Vue from "vue";
import Notifier from "./../../components/Notifier.vue";

export default class Notifications {
  private static activeNotifs = new Map<string, Notifier>();

  public static popup(name: string, done: boolean, percentage?: number) {
    if (done) {
      const i = this.activeNotifs.get(name);
      i?.$destroy();
      i?.$el.remove();
      this.activeNotifs.delete(name);
      return;
    }

    if (this.activeNotifs.has(name)) {
      const i = this.activeNotifs.get(name);
      if (i != undefined) i.$data.percent = percentage;
    } else {
      const notifier = Vue.extend(Notifier);
      const instance = new notifier({
        propsData: {
          description: 'Downloading FFmpeg',
          percentage: percentage
        }
      });
  
      instance.$mount();
      document.getElementById("notifications")?.appendChild(instance.$el);

      this.activeNotifs.set(name, instance);
    }
  }
}
