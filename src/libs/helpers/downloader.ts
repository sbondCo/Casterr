import * as https from "https";
import { IncomingMessage } from 'http';
import * as fs from "fs";
import * as path from "path";
import jsZip from 'jszip';

export default class Downloader {
  /**
   * Download a file
   * @param uri URI to download file from
   * @param dest Destination path for downloaded file
   */
  public static get(uri: string, dest: string, reportPercentage?: CallableFunction) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);

      console.log("hi downloader i am");

      https.get(uri, (resp: IncomingMessage) => {
        let contentLength = parseInt(resp.headers['content-length']!);
        let chunksCompleted = 0;

        resp.on("data", (chunk) => {
          chunksCompleted += chunk.length;
          
          // Call callback function if its set and pass percentage to it
          if (reportPercentage != undefined) reportPercentage((100.0 * chunksCompleted / contentLength).toFixed(0));
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

  /**
   * Extract zip archive
   * @param zipPath Path to zip file that should be uncompressed
   * @param destFolder Path to destination folder for uncompressed files
   * @param filesToExtract String array of file names, only files included in this array will be extracted
   */
  public static extract(zipPath: string, destFolder: string, filesToExtract: Array<string> = []) {
    return new Promise((resolve, reject) => {
      fs.readFile(zipPath, (err, data) => {
        if (err) reject(err);

        var zip = new jsZip();

        zip.loadAsync(data).then((contents: any) => {
          Object.keys(contents.files).forEach((filename: string) => {
            // Write zip file to destination folder
            let unzip = () => {
              zip.file(filename)!.async('nodebuffer').then((content: any) => {
                fs.writeFileSync(path.join(destFolder, filename), content);
              });
            };

            // If filesToExtract is empty just unzip all files
            // If filesToExtract isn't empty, if it includes filename then unzip
            if (filesToExtract.length == 0) unzip();
            else if (filesToExtract.includes(filename)) unzip();
          });
        }).then(() => {
          resolve();
        });
      });
    });
  }
}
