import * as https from "https";
import { IncomingMessage } from 'http';
import * as fs from "fs";
import * as path from "path";
const jsZip = require('jszip');

export default class Downloader {
  /**
   * Download a file
   * @param uri URI to download file from
   * @param dest Destination path for downloaded file
   */
  public static get(uri: string, dest: string) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);

      console.log("hi downloader i am");

      https.get(uri, (resp: IncomingMessage) => {
        console.log(resp.headers['content-length']);

        resp.on("data",(chunk) => {
          console.log(chunk);
        });

        // When connection is closed, resolve promise
        resp.on("close", () => {
          resolve();
        });

        // Reject promise on error
        resp.on("error", (err: Error) => {
          reject(err);
        });

        resp.pipe(file);
      });
    });
  }

  public static extract(zipPath: string, destFolder: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(zipPath, (err, data) => {
        if (err) reject(err);

        var zip = new jsZip();

        zip.loadAsync(data).then((contents: any) => {
          Object.keys(contents.files).forEach((filename) => {
            console.log(filename);

            zip.file(filename).async('nodebuffer').then((content: any) => {
              fs.writeFileSync(path.join(destFolder, filename), content);
            });
          });
        }).then(() => {
          resolve();
        });
      });
    });
  }
}
