import { ipcRenderer, Display } from "electron";

export default class Screens {
  public static async getAll(): Promise<Display[]> {
    return await ipcRenderer.invoke("get-screens");
  }
}
