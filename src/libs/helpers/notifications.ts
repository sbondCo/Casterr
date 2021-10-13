import Vue from "vue";
import { CombinedVueInstance } from "vue/types/vue";
import { ipcRenderer } from "electron";
import Notifier from "@/components/Notifier.vue";

export default class Notifications {
  private static activePopups = new Map<
    string,
    CombinedVueInstance<Record<never, any> & Vue, object, object, object, Record<never, any>>
  >();

  /**
   * Create or modify an existing popup notification.
   * @param name Name of notification.
   * @param desc Description for notification to display.
   * @param options
   * @returns
   */
  public static popup(
    name: string,
    desc: string,
    options?: { percentage?: string | number; loader?: boolean; showCancel?: boolean; buttons?: string[] }
  ) {
    return new Promise<string>((resolve, reject) => {
      // Update or create popup depending on if it is in activePopups
      if (this.activePopups.has(name)) {
        const i = this.activePopups.get(name);

        // Update popup data everytime, incase of updated data sent to func
        if (i != undefined) i.$data.desc = desc;
        if (i != undefined) i.$data.percent = options?.percentage;
      } else {
        // Create Notifier instance
        const notifier = Vue.extend(Notifier);
        const instance = new notifier({
          propsData: {
            description: desc,
            percentage: options?.percentage,
            loader: options?.loader,
            showCancel: options?.showCancel ?? true,
            buttons: options?.buttons ? options.buttons : null
          }
        });

        // Mount and append to DOM in notifications section
        instance.$mount();
        document.getElementById("notifications")?.appendChild(instance.$el);

        // Listen for an element clicked then resolve method with it's value
        instance.$on("element-clicked", (elClicked: string) => {
          resolve(elClicked);
        });

        // Add to activePopups
        this.activePopups.set(name, instance);
      }
    });
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

  /**
   * Create custom desktop notification.
   * @param desc Text to display on notification.
   * @param icon Icon to display alongside text on notification.
   * @param duration How long the notification should stay open before closing.
   */
  public static async desktop(desc: string, icon?: string, duration: number = 4000) {
    // Create new window for notification
    ipcRenderer.send("create-desktop-notification", { desc, icon, duration });
  }
}
