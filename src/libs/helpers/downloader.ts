import * as https from "https";
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
    const file = fs.createWriteStream(dest);

    https.get(uri, (resp) => {
      resp.pipe(file);
    });
  }

  public static extract(zipPath: string, destFolder: string) {
    fs.readFile(zipPath, (err, data) => {
      if (!err) {
        var zip = new jsZip();
        zip.loadAsync(data).then((contents: any) => {
          Object.keys(contents.files).forEach((filename) => {
            console.log(filename);

            zip.file(filename).async('nodebuffer').then((content: any) => {
              fs.writeFileSync(path.join(destFolder, filename), content);
            });
          });
        });
      }
    });
  }
}
