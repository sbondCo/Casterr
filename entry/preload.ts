import { contextBridge, ipcRenderer } from "electron";
import fs from "fs";
import path from "path";
import os from "os";
import jsZip from "jszip";

const mainAPI = {
  /**
   * Send an asynchronous message to the main process.
   * Mainly used for accessing electron api.
   * https://www.electronjs.org/docs/latest/api/ipc-renderer/#ipcrenderersendchannel-args
   */
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },

  /**
   * Same as send, but we expect an asynchronous response.
   * https://www.electronjs.org/docs/latest/api/ipc-renderer/#ipcrendererinvokechannel-args
   */
  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args);
  },

  /**
   * PathHelper.extract() is now just a wrapper for this.
   * nodebuffer isn't exposed in mainworld, if theres a better way
   * of having this code in pathHelper, it will be moved back later.
   * Not sure of the performance impact of using blob/arraybuffer instead of nodebuffer,
   * this way we can keep using nodebuffer.
   */
  unzip: (zipPath: string, destFolder: string, filesToExtract: Array<string> = [], deleteAfter: boolean = true) => {
    return new Promise((resolve, reject) => {
      fs.promises
        .readFile(zipPath)
        .then((data) => {
          const zip = new jsZip();

          zip.loadAsync(data).then((contents: jsZip) => {
            const files = contents.files;

            // Delete directories from object
            for (const f in files) {
              if (files[f].dir == true) delete files[f];
            }

            Object.keys(files).forEach(async (filename: string, i) => {
              const filenameWithoutFolder = path.basename(filename);

              // Write zip file to destination folder
              const unzip = () => {
                return new Promise((resolve) => {
                  zip
                    .file(filename)!
                    .async("nodebuffer")
                    .then((content: any) => {
                      fs.promises
                        .writeFile(path.join(destFolder, filenameWithoutFolder), content)
                        .then(() => resolve(""));
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
                  fs.promises.unlink(zipPath).catch((e) => {
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
};

const nodeAPI = {
  fs: {
    ...fs.promises,
    constants: fs.constants
  },
  path: {
    join: (...paths: string[]) => {
      return path.join(...paths);
    },
    dirname: (p: string) => {
      return path.dirname(p);
    },
    basename: (p: string, ext?: string) => {
      return path.basename(p, ext);
    },
    extname: (p: string) => {
      return path.extname(p);
    }
  },
  os: {
    homedir: () => {
      return os.homedir();
    }
  }
};

export type mainAPI = typeof mainAPI;
export type nodeAPI = typeof nodeAPI;

contextBridge.exposeInMainWorld("api", mainAPI);
contextBridge.exposeInMainWorld("node", nodeAPI);
