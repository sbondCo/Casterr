import * as os from "os";
import * as Path from "path";
import * as fs from "fs";

export default class PathHelper {
  public static get mainFolderPath() {
    return Path.join(os.homedir(), "Documents", "Casterr");
  }

  public static get homeFolderPath() {
    return os.homedir();
  }

  /**
   * Get the path to a file used by Casterr.
   * Paths are hardcoded, only supported files that are listed here will work.
   * @param name Name of file with extension
   */
  public static getFile(
    name: "GeneralSettings.json" | "RecordingSettings.json" | "KeyBindingSettings.json" | "PastRecordings.json"
  ) {
    let path: string[];

    switch (name) {
      case "GeneralSettings.json":
        path = ["Settings", "GeneralSettings.json"];
        break;
      case "RecordingSettings.json":
        path = ["Settings", "RecordingSettings.json"];
        break;
      case "KeyBindingSettings.json":
        path = ["Settings", "KeyBindingSettings.json"];
        break;
      case "PastRecordings.json":
        path = ["PastRecordings.json"];
        break;
    }

    // Join `mainFolderPath` and `path` to create the
    // full path that we should make sure exists then return
    return this.ensureExists(Path.join(this.mainFolderPath, ...path));
  }

  /**
   * Make sure files/dirs exist from path
   * @param path Path of file/folder
   * @param isDir Is `path` pointing to a directory?
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
      fs.writeFileSync(path, "", { flag: "wx" });
    } catch (err) {
      // If exception is caused by file already existing,
      // don't throw it. Throw again if caused by something else.
      if (err.code != "EEXIST") {
        throw new Error(err);
      }
    }

    return path;
  }

  /**
   * Returns name of file without it's extension.
   * @param path Full path of file.
   */
  public static fileNameNoExt(path: string) {
    return Path.basename(path).replace(Path.extname(path), "");
  }

  /**
   * Recursively remove everything inside a
   * directory and then remove the directory itself.
   * @param path
   */
  public static removeDir(path: string) {
    if (fs.existsSync(path)) {
      fs.readdir(path, (_, files) => {
        if (files) {
          files.forEach((file) => {
            fs.unlinkSync(Path.join(path, file));
          });
        }

        fs.rmdirSync(path);
      });
    }
  }
}
