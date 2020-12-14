import Vue from "vue";
import Notifier from "./../../components/Notifier.vue";

export default class Notifications {
  private static activeNotifs = new Map<string, Notifier>();

  /**
   * Create popup notification.
   * @param name Name of notification.
   * @param done If done with notification. True will remove it's instance.
   * @param percentage Optional percentage for notifications requiring percentage bar.
   */
  public static popup(name: string, done: boolean, percentage?: number) {
    if (done) {
      // Get Notifier from activeNotifs map
      const i = this.activeNotifs.get(name);

      // Cleanup component and remove from DOM
      i?.$destroy();
      i?.$el.remove();

      // Delete from activeNotifcs
      this.activeNotifs.delete(name);

      return;
    }

    // Update or create notification depending on if it is in activeNotifs
    if (this.activeNotifs.has(name)) {
      const i = this.activeNotifs.get(name);
      if (i != undefined) i.$data.percent = percentage;
    } else {
      // Create Notifier instance
      const notifier = Vue.extend(Notifier);
      const instance = new notifier({
        propsData: {
          description: 'Downloading FFmpeg',
          percentage: percentage
        }
      });
  
      // Mount and append to DOM in notifications section
      instance.$mount();
      document.getElementById("notifications")?.appendChild(instance.$el);

      // Add to activeNotifs
      this.activeNotifs.set(name, instance);
    }
  }
}
