const os = require('os');
const path = require("path");

export class PathHelper {
  public static mainFolderPath() {
    return path.join(os.homedir(), 'Casterr');
  }
}
