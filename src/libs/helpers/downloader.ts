import * as https from "https";
import { IncomingMessage } from "http";
import { RequestOptions } from "node:https";
import * as fs from "fs";
import * as path from "path";
import jsZip from "jszip";

export default class Downloader {
  private _accept: string = "*";
  private _userAgent: string = "casterr";

  public get userAgent() {
    return this._userAgent;
  }

  public set userAgent(ua: string) {
    this._userAgent = ua;
  }

  public get accept() {
    return this._accept;
  }

  public set accept(accept: string) {
    this._accept = accept;
  }

  /**
   * Download a file
   * @param uri URI to download file from
   * @param dest Destination path for downloaded file
   */
  public get(uri: string, dest: string, callback?: (percentage: string) => void) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      const reqOptions: RequestOptions = {
        headers: {
          Accept: this.accept,
          "User-Agent": this.userAgent
        }
      };

      https.get(uri, reqOptions, (resp: IncomingMessage) => {
        // If redirect, download from location in headers.
        if (resp.statusCode == 302) {
          resolve(this.get(resp.headers.location!, dest, callback));
        }

        const contentLength = parseInt(resp.headers["content-length"]!, 10);
        let chunksCompleted = 0;

        resp.on("data", (chunk) => {
          chunksCompleted += chunk.length;

          // Call callback function if its set and pass percentage to it
          if (callback != undefined) callback(((100.0 * chunksCompleted) / contentLength).toFixed(0));
        });

        // When connection is closed, resolve promise
        resp.on("close", () => {
          resolve("");
        });

        // Reject promise on error
        resp.on("error", (err: Error) => {
          reject(err);
        });

        resp.pipe(file);
      });
    });
  }

  /**
   * Extract zip archive
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
            const filenameWithoutFolder = path.basename(filename);

            // Write zip file to destination folder
            const unzip = () => {
              return new Promise((resolve) => {
                zip
                  .file(filename)!
                  .async("nodebuffer")
                  .then((content: any) => {
                    fs.writeFile(path.join(destFolder, filenameWithoutFolder), content, () => {
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
