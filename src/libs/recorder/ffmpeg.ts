import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";
import Downloader from "./../helpers/downloader";
import Notifications from "./../helpers/notifications";
import PathHelper from "../helpers/pathHelper";

export default class FFmpeg {
  constructor(private which: "ffmpeg" | "ffprobe" = "ffmpeg") {}

  /**
   * FFmpeg exe name which is dependent on the user's platform.
   */
  public static get ffmpegExeName() {
    if (process.platform == "win32") {
      return "ffmpeg.exe";
    } else {
      return "ffmpeg";
    }
  }

  /**
   * FFprobe exe name which is dependent on the user's platform.
   */
  public static get ffprobeExeName() {
    if (process.platform == "win32") {
      return "ffprobe.exe";
    } else {
      return "ffprobe";
    }
  }

  // FFmpeg/probe process
  private ffProcess: childProcess.ChildProcess | undefined;

  /**
   * Run FF process and send args to it.
   * @param args Args to send.
   * @param whenToResolve On what event of the ffmpeg process to resolve promise.
   * @param outputs Holds optional callback functions with outputs from FFmpeg/FFprobe.
   */
  public async run(
    args: string,
    whenToResolve: "onExit" | "onOpen" = "onExit",
    outputs?: {
      stdoutCallback?: CallableFunction;
      stderrCallback?: CallableFunction;
      onExitCallback?: CallableFunction;
    }
  ) {
    // Get FFmpeg path
    const ffPath = await this.getPath();

    return new Promise((resolve) => {
      // Create child process and send args to it
      this.ffProcess = childProcess.exec(`${ffPath} ${args}`);

      if (whenToResolve == "onOpen") resolve("started");

      // Run stdoutCallback when recieving stdout
      this.ffProcess.stdout!.on("data", (data) => {
        if (outputs?.stdoutCallback != undefined) outputs?.stdoutCallback(data);
      });

      // Run stderrCallback when recieving stderr
      this.ffProcess.stderr!.on("data", (data) => {
        if (outputs?.stderrCallback != undefined) outputs?.stderrCallback(data);
      });

      // When ffProcess exits
      this.ffProcess.on("close", (code) => {
        // Call onExitCallback if set to do so
        if (outputs?.onExitCallback != undefined) outputs?.onExitCallback(code);

        if (whenToResolve == "onExit") resolve(code);
      });
    });
  }

  /**
   * Kill FF process.
   */
  public async kill() {
    return new Promise<void>((resolve, reject) => {
      if (this.ffProcess != undefined) {
        // FFmpeg gracefully stops recording when you press q
        this.ffProcess.stdin?.write("q");

        this.ffProcess.on("exit", () => {
          this.ffProcess = undefined;
          resolve();
        });
      } else {
        reject("Can't stop FFmpeg when it's not currently running!");
      }
    });
  }

  /**
   * Get path to FFmpeg/probe.
   * If FFmpeg/probe doesn't exist, download it first then return its path.
   */
  public async getPath() {
    const ffDir = PathHelper.ensureExists(PathHelper.toolsPath, true);
    const ffmpegPath = path.join(ffDir, FFmpeg.ffmpegExeName);
    const ffprobePath = path.join(ffDir, FFmpeg.ffprobeExeName);

    // If ffmpeg or ffprobe does not exist, go download it
    if (!fs.existsSync(ffmpegPath) || !fs.existsSync(ffprobePath)) {
      const downloadTo = ffmpegPath + ".zip";
      let dlURL: string;

      // Set downloadURL depending on users platform
      if (process.platform == "win32") {
        dlURL = "https://ul.sbond.co/ffmpeg/ffmpeg-latest-win-amd64.zip";
      } else if (process.platform == "linux") {
        dlURL = "https://ul.sbond.co/ffmpeg/ffmpeg-release-linux-amd64.zip";
      } else {
        throw new Error("Unsupported platform");
      }

      // Download zip
      await Downloader.get(dlURL, downloadTo, (progress: number) => {
        // Keep updating popup with new progress %
        Notifications.popup("ffmpegDownloadProgress", "Fetching Recording Utilities", progress);
      });

      // Update popup to extracting phase
      Notifications.popup("ffmpegDownloadProgress", "Extracting Recording Utilities", undefined);

      // Extract zip
      await Downloader.extract(downloadTo, ffDir, [FFmpeg.ffmpegExeName, FFmpeg.ffprobeExeName]);

      // Delete popup
      Notifications.deletePopup("ffmpegDownloadProgress");

      // Temporary - sleep for 1 second to give enough time for file to be able to be accessed
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Get exec perms for ff binaries.
    // Do this even if we didn't just download so there
    // is no reason for it to fail with 'no perms' error.
    fs.chmodSync(ffmpegPath, 0o111);
    fs.chmodSync(ffprobePath, 0o111);

    // Return path to correct executable depending on 'which' constructor arg
    if (this.which == "ffprobe") return ffprobePath;
    else return ffmpegPath;
  }
}
