// import Vue from "vue";
// import { CombinedVueInstance } from "vue/types/vue";
// import Notifier from "@/components/Notifier.vue";

interface PopupOptions {
  /**
   * If should show a percentage bar.
   */
  percentage?: string | number;

  /**
   * If should show an infinite loader.
   */
  loader?: boolean;

  /**
   * If should show a cancel icon in popup.
   * Method will resolve with an `action` of "cancel".
   */
  showCancel?: boolean;

  /**
   * String array of button names.
   * Method will resolve with an `action` of the name of the button clicked.
   */
  buttons?: string[];

  /**
   * String array of tickbox names.
   * Method will resolve after a button is clicked with a list of tickbox
   * names that have been ticked.
   */
  tickBoxes?: string[] | TickBoxInfo[];
}

interface TickBoxInfo {
  name: string;
  ticked: boolean;
}

export default class Notifications {
  // private static activePopups = new Map<
  //   string,
  //   CombinedVueInstance<Record<never, any> & Vue, object, object, object, Record<never, any>>
  // >();

  /**
   * Create or modify an existing popup notification.
   * @param name Name of notification.
   * @param desc Description for notification to display.
   * @param options Optional popup options for things such as displaying button, percentage, etc.
   * @returns
   */
  public static popup(name: string, desc: string, options?: PopupOptions) {
    console.log("popup");

    return new Promise<{ action: string; tickBoxesChecked?: string[] }>((resolve, reject) => {});

    // return new Promise<{ action: string; tickBoxesChecked?: string[] }>((resolve, reject) => {
    //   // Update or create popup depending on if it is in activePopups
    //   if (this.activePopups.has(name)) {
    //     const i = this.activePopups.get(name);

    //     // Update popup data everytime, incase of updated data sent to func
    //     if (i != undefined) i.$data.desc = desc;
    //     if (i != undefined) i.$data.percent = options?.percentage;
    //   } else {
    //     const tickBoxNames = new Array<string>();
    //     const tickBoxesChecked = new Array<string>();

    //     if (options?.tickBoxes != undefined) {
    //       // Loop over tickboxes array passed adding to tickBoxNames/Checked
    //       for (let i = 0; i < options.tickBoxes.length; i++) {
    //         // If tickBoxes is passed in as TickBoxInfo[]
    //         // also add to tickBoxesChecked depending on `ticked` value passed in it.
    //         if ((options.tickBoxes[i] as TickBoxInfo).name !== undefined) {
    //           const el = options.tickBoxes[i] as TickBoxInfo;

    //           tickBoxNames.push(el.name);
    //           if ((el as TickBoxInfo).ticked) tickBoxesChecked.push(el.name);
    //         } else {
    //           const el = options.tickBoxes[i] as string;

    //           tickBoxNames.push(el);
    //         }
    //       }
    //     }

    //     // Create Notifier instance
    //     const notifier = Vue.extend(Notifier);
    //     const instance = new notifier({
    //       propsData: {
    //         description: desc,
    //         percentage: options?.percentage,
    //         loader: options?.loader,
    //         showCancel: options?.showCancel ?? true,
    //         buttons: options?.buttons,
    //         tickBoxes: tickBoxNames,
    //         tickBoxesChecked: tickBoxesChecked
    //       }
    //     });

    //     // Mount and append to DOM in notifications section
    //     instance.$mount();
    //     document.getElementById("notifications")?.appendChild(instance.$el);

    //     // Listen for an element clicked then resolve method with it's value
    //     instance.$on("element-clicked", (elClicked: string, tickBoxesChecked?: string[]) => {
    //       resolve({ action: elClicked, tickBoxesChecked: tickBoxesChecked });
    //     });

    //     // Add to activePopups
    //     this.activePopups.set(name, instance);
    //   }
    // });
  }

  /**
   * Delete existing popup notification.
   * @param name Name of notification.
   */
  public static deletePopup(name: string) {
    console.log("deletepopup");
    // // Get Notifier from activeNotifs map
    // const i = this.activePopups.get(name);

    // // Cleanup component and remove from DOM
    // i?.$destroy();
    // i?.$el.remove();

    // // Delete from activeNotifcs
    // this.activePopups.delete(name);
  }

  /**
   * Create custom desktop notification.
   * @param desc Text to display on notification.
   * @param icon Icon to display alongside text on notification.
   * @param duration How long the notification should stay open before closing.
   */
  public static async desktop(desc: string, icon?: string, duration: number = 4000) {
    // Create new window for notification
    window.api.send("create-desktop-notification", { desc, icon, duration });
  }
}
