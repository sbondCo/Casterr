import os from "os";
import Path from "path";
import { promises as fs, constants as fsconstants } from "fs";
import childProcess from "child_process";
import jsZip from "jszip";

export default class PathHelper {
  public static get mainFolderPath() {
    return Path.join(os.homedir(), "Documents", "CasterrNew");
  }

  public static get toolsPath() {
    return Path.join(this.mainFolderPath, "tools");
  }

  public static get homeFolderPath() {
    return os.homedir();
  }

  /**
   * Get the path to a file used by Casterr.
   * Paths are hardcoded, only supported files that are listed here will work.
   * @param name Name of file with extension
   */
  public static getFile(name: "settings" | "recordings" | "clips") {
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
    return this.ensureExists(Path.join(this.mainFolderPath, ...path));
  }

  public static async exists(path: string): Promise<boolean> {
    return fs
      .access(path, fsconstants.F_OK)
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
      await fs.mkdir(isDir ? path : Path.dirname(path), { recursive: true });

      // Only write a file if `!isDir`.
      // Needs to be after making dirs since this method
      // will fail if the dir the file is being written in doesn't exist.
      if (!isDir) await fs.writeFile(path, "", { flag: "wx" });

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
  public static async removeDir(path: string) {
    return fs
      .readdir(path)
      .then((files) => {
        if (files) files.forEach((f) => fs.unlink(Path.join(path, f)));

        fs.rmdir(path);
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
    return fs.unlink(path).catch((e) => {
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
      fs.readFile(zipPath)
        .then((data) => {
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
                      fs.writeFile(Path.join(destFolder, filenameWithoutFolder), content).then(() => resolve(""));
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
                  fs.unlink(zipPath).catch((e) => {
                    throw e;
                  });
                }

                resolve("");
              }
            });
          });
        })
        .catch((e) => reject(e));
    });
  }
}
