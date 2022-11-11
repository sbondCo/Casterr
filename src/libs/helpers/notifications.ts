import { popupCreated } from "@/app/appSlice";
import { store } from "@/app/store";
import { ipcRenderer } from "electron";

export interface PopupOptions {
  /**
   * Purely used for locating the popup in state array.
   * Import so we can locate it for updating.
   *
   * DO **NOT** INCLUDE SPACES. We can trust ourselves right?
   */
  id: string | number;

  /**
   * Popup title/header to be shown.
   */
  title: string;

  /**
   * If should show a percentage bar.
   */
  percentage?: number;

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
  tickBoxes?: TickBoxInfo[];
}

interface TickBoxInfo {
  name: string;
  ticked?: boolean;
}

export default class Notifications {
  /**
   * Create or modify an existing popup notification.
   * @param name Name of notification.
   * @param desc Description for notification to display.
   * @param options Optional popup options for things such as displaying button, percentage, etc.
   * @returns
   */
  public static popup(opts: PopupOptions) {
    store.dispatch(popupCreated(opts));

    return new Promise((resolve, reject) => {
      const listnr = ((ev: CustomEvent) => {
        document.removeEventListener(`${opts.id}-el-clicked`, listnr);
        resolve({ action: ev.detail.elClicked, tickBoxesChecked: ev.detail.tickBoxesChecked });
      }) as EventListener;

      document.addEventListener(`${opts.id}-el-clicked`, listnr);
    });
  }

  /**
   * Delete existing popup notification.
   * @param name Name of notification.
   */
  public static deletePopup(name: string) {}

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
