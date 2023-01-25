import path from "path";
import os from "os";

export default class Paths {
  public static get mainFolderPath() {
    return path.join(os.homedir(), "Documents", "Casterr");
  }

  public static get toolsPath() {
    return path.join(this.mainFolderPath, "tools");
  }

  public static get logsPath() {
    return path.join(this.mainFolderPath, "logs");
  }

  public static get homeFolderPath() {
    return os.homedir();
  }
}
