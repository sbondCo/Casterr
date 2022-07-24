import childProcess from "child_process";
import { OS, Path, FS, Process } from "../node";

export default class PathHelper {
  public static get mainFolderPath() {
    return Path.join(window.node.os.homedir(), "Documents", "CasterrNew");
  }

  public static get toolsPath() {
    return Path.join(this.mainFolderPath, "Tools");
  }

  public static get homeFolderPath() {
    return OS.homedir();
  }

  /**
   * Get the path to a file used by Casterr. If doesn't exist, will create it.
   * Paths are hardcoded, only supported files that are listed here will work.
   * @param name Name of file with extension
   */
  public static async getFile(name: "settings" | "recordings" | "clips") {
    let path: string[];

    switch (name) {
      case "settings":
        path = ["settings.json"];
        break;
      case "recordings":
        path = ["Recordings.json"];
        break;
      case "clips":
        path = ["Clips.json"];
        break;
    }

    // Join `mainFolderPath` and `path` to create the
    // full path that we should make sure exists then return
    return await this.ensureExists(Path.join(this.mainFolderPath, ...path));
  }

  public static async exists(path: string): Promise<boolean> {
    return FS.access(path, FS.constants.F_OK)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Make sure files/dirs exist from path
   * @param path Path of file/folder
   * @param isDir Is `path` pointing to a directory?
   * @returns The path input.
   */
  public static async ensureExists(
    path: string,
    isDir: boolean = false,
    options?: { hidden: boolean }
  ): Promise<string> {
    // If exists, return
    if (await this.exists(path)) return path;

    try {
      // Recursively create all folders.
      // If `!isDir`, get dirname from path first, so we don't
      // create a folder for the file.
      await FS.mkdir(isDir ? path : Path.dirname(path), { recursive: true });

      // Only write a file if `!isDir`.
      // Needs to be after making dirs since this method
      // will fail if the dir the file is being written in doesn't exist.
      if (!isDir) await FS.writeFile(path, "", { flag: "wx" });

      if (options != undefined) {
        if (options.hidden) {
          this.hide(path);
        }
      }
    } catch (e) {
      throw new Error(`Error ensuring file exists: ${e}`);
    }

    return path;
  }

  /**
   * Hide file or folder.
   * @param path Path to file/folder that needs to be hidden.
   */
  public static hide(path: string) {
    return new Promise((resolve, reject) => {
      // Only allow files that start with a period, this is how we will ensure the path is hidden on linux
      if (!Path.basename(path).startsWith(".")) {
        reject(
          `Hidden files/folders should start with a '.'! change '${Path.basename(path)}' to '.${Path.basename(path)}'.`
        );
      }

      // If on windows, run `attrib` command to hide folder
      if (Process.platform == "win32") {
        const cp = childProcess.exec(`attrib +h ${path}`);

        cp.on("exit", (code) => {
          if (code == 0) {
            resolve(code);
          } else {
            reject(code);
          }
        });
      } else {
        // Nothing to do on other platforms, so just make sure to resolve promise
        resolve(0);
      }
    });
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
  public static async removeDir(path: string) {
    return FS.readdir(path)
      .then((files) => {
        if (files) files.forEach((f) => FS.unlink(Path.join(path, f)));

        FS.rmdir(path);
      })
      .catch((e) => {
        throw Error(`Error removing dir: ${e}`);
      });
  }

  /**
   * Delete a file if it exists, if it doesn't, do nothing.
   * @param path Path to file that should be deleted.
   */
  public static async removeFile(path: string) {
    return FS.unlink(path).catch((e) => {
      throw Error(`Unable to remove file: ${e}`);
    });
  }

  /**
   * Extract zip archive.
   * @param zipPath Path to zip file that should be uncompressed.
   * @param destFolder Path to destination folder for uncompressed files.
   * @param filesToExtract String array of file names, only files included in this array will be extracted. Leave empty to extract all files.
   * @param deleteAfter If should delete zip file once finished extracting files.
   */
  public static extract(
    zipPath: string,
    destFolder: string,
    filesToExtract: Array<string> = [],
    deleteAfter: boolean = true
  ) {
    return new Promise((resolve, reject) => {
      window.api
        .unzip(zipPath, destFolder, filesToExtract, deleteAfter)
        .then(() => resolve(""))
        .catch((e) => reject(e));
    });
  }
}
