const os = require('os');
const path = require("path");

export default class PathHelper {
  public static mainFolderPath() {
    return path.join(os.homedir(), 'Casterr');
  }
}
