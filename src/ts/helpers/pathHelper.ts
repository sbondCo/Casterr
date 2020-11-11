const os = require('os');
const path = require("path");

export default class PathHelper {
  public static get mainFolderPath() {
    return path.join(os.homedir(), 'Casterr');
  }

  public static get settingsFolderPath() {
    return path.join(PathHelper.mainFolderPath, "Settings");
  }

  public static get thumbsFolderPath() {
    return path.join(PathHelper.mainFolderPath, "Thumbs");
  }
}
