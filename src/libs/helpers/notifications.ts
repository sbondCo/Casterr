import Vue from "vue";
import { CombinedVueInstance } from 'vue/types/vue';
import Notifier from "./../../components/Notifier.vue";

export default class Notifications {
  private static activePopups = new Map<string, CombinedVueInstance<Record<never, any> & Vue, object, object, object, Record<never, any>>>();

  /**
   * Create or modify an existing popup notification.
   * @param name Name of notification.
   * @param desc Description for notification to display.
   * @param percentage Optional percentage for notifications requiring a percentage bar.
   */
  public static popup(name: string, desc: string, percentage?: number) {
    // Update or create notification depending on if it is in activeNotifs
    if (this.activePopups.has(name)) {
      const i = this.activePopups.get(name);

      // Update notification data everytime, incase of updated data sent to func
      if (i != undefined) i.$data.desc = desc;
      if (i != undefined) i.$data.percent = percentage;
    } else {
      // Create Notifier instance
      const notifier = Vue.extend(Notifier);
      const instance = new notifier({
        propsData: {
          description: desc,
          percentage: percentage
        }
      });

      // Mount and append to DOM in notifications section
      instance.$mount();
      document.getElementById("notifications")?.appendChild(instance.$el);

      // Add to activeNotifs
      this.activePopups.set(name, instance);
    }
  }

  /**
   * Delete existing popup notification.
   * @param name Name of notification.
   */
  public static deletePopup(name: string) {
    // Get Notifier from activeNotifs map
    const i = this.activePopups.get(name);

    // Cleanup component and remove from DOM
    i?.$destroy();
    i?.$el.remove();

    // Delete from activeNotifcs
    this.activePopups.delete(name);
  }
}
