import fs from "fs";
import childProcess from "child_process";
import jsZip from "jszip";
import { OS, Path } from "../node";

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
   * Get the path to a file used by Casterr.
   * Paths are hardcoded, only supported files that are listed here will work.
   * @param name Name of file with extension
   */
  public static getFile(
    name:
      | "GeneralSettings.json"
      | "RecordingSettings.json"
      | "KeyBindingSettings.json"
      | "Recordings.json"
      | "Clips.json"
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
      case "Recordings.json":
        path = ["Recordings.json"];
        break;
      case "Clips.json":
        path = ["Clips.json"];
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
  public static ensureExists(path: string, isDir: boolean = false, options?: { hidden: boolean }): string {
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
      if ((err as any).code != "EEXIST") {
        throw new Error(err as any);
      }
    }

    if (options != undefined) {
      if (options.hidden) {
        this.hide(path);
      }
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
      if (process.platform == "win32") {
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

  /**
   * Delete a file if it exists, if it doesn't do nothing.
   * @param path Path to file that should be deleted.
   */
  public static removeFile(path: string) {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
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
      fs.readFile(zipPath, (err, data) => {
        if (err) reject(err);

        const zip = new jsZip();

        zip.loadAsync(data).then((contents: jsZip) => {
          const files = contents.files;

          // Delete directories from object
          for (const f in files) {
            if (files[f].dir == true) delete files[f];
          }

          Object.keys(files).forEach(async (filename: string, i) => {
            const filenameWithoutFolder = Path.basename(filename);

            // Write zip file to destination folder
            const unzip = () => {
              return new Promise((resolve) => {
                zip
                  .file(filename)!
                  .async("nodebuffer")
                  .then((content: any) => {
                    fs.writeFile(Path.join(destFolder, filenameWithoutFolder), content, () => {
                      resolve("");
                    });
                  });
              });
            };

            // If filesToExtract is empty just unzip all files
            // If filesToExtract isn't empty, if it includes filename then unzip
            if (filesToExtract.length == 0) await unzip();
            else if (filesToExtract.includes(filenameWithoutFolder)) await unzip();

            // Resolve if index (+1) equals amount of files since this means all files have been processed
            if (i + 1 == Object.keys(files).length) {
              // Delete zip file if asked to.
              // Don't wait for file to delete before resolving the promise,
              // theres no reason to make the user wait for it to finish deleting the zip.
              if (deleteAfter) {
                fs.unlink(zipPath, (err) => {
                  if (err) throw err;
                });
              }

              resolve("");
            }
          });
        });
      });
    });
  }
}
