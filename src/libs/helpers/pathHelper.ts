import * as os from "os";
import * as Path from "path";
import * as fs from "fs";

export default class PathHelper {
  public static get mainFolderPath() {
    return Path.join(os.homedir(), 'Documents', 'Casterr');
  }

  public static get settingsFolderPath() {
    return Path.join(PathHelper.mainFolderPath, "Settings");
  }

  /**
   * Make sure files/dirs exist from path
   * @param path Path of file/folder
   * @param isDir Is path to a dir?
   */
  public static ensureExists(path: string, isDir: boolean = false): string {
    let folders = path;

    if (!isDir) {
      folders = Path.dirname(path);
    }

    // Recursively create all folders
    fs.mkdirSync(folders, { recursive: true });
    
    try {
      // Create file if it doesn't exist
      fs.writeFileSync(path, "", { flag: 'wx' });
    }
    catch (err) {
      // If exception is caused by file already existing,
      // don't throw it. Throw again if caused by something else.
      if (err.code != "EEXIST") {
        throw new Error(err);
      }
    }

    return path;
  }
}
