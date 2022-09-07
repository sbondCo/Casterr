import https from "https";
import { IncomingMessage } from "http";
import { RequestOptions } from "node:https";
import fs from "fs";

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
}
