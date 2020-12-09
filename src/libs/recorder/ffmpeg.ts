import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";
import Downloader from "./../helpers/downloader";

export default class FFmpeg {
  constructor(private which: "ffmpeg" | "ffprobe" = "ffmpeg") {

  }

  /**
   * FFmpeg exe name which is dependent on the user's platform.
   */
  public static get ffmpegExeName() {
    if (process.platform == 'win32') {
      return "ffmpeg.exe";
    }
    else {
      return "ffmpeg";
    }
  }

  /**
   * FFprobe exe name which is dependent on the user's platform.
   */
  public static get ffprobeExeName() {
    if (process.platform == 'win32') {
      return "ffprobe.exe";
    }
    else {
      return "ffprobe";
    }
  }

  // FFmpeg/probe process
  private ffProcess: childProcess.ChildProcess;

  /**
   * Run FF process and send args to it.
   * @param args Args to send.
   * @param outputs Holds optional callback functions with outputs from FFmpeg/FFprobe.
   */
  public async run(args: string, outputs?: { stdoutCallback?: CallableFunction, stderrCallback?: CallableFunction; }) {
    // Get FFmpeg path
    const ffPath = await this.getPath();

    // Get exec perms for ff binary
    fs.chmodSync(ffPath, 0o111);

    // Create child process and send args to it
    this.ffProcess = childProcess.exec(`${ffPath} ${args}`);

    // Run stdoutCallback when recieving stdout
    this.ffProcess.stdout!.on('data', (data) => {
      if (outputs?.stdoutCallback != undefined) outputs?.stdoutCallback(data);
    });

    // Run stderrCallback when recieving stderr
    this.ffProcess.stderr!.on('data', (data) => {
      if (outputs?.stderrCallback != undefined) outputs?.stderrCallback(data);
    });

    // When ffProcess exits
    this.ffProcess.on('close', (code) => {
      console.log(`ffmpeg exited with code ${code}`);
    });
  }

  /**
   * Kill FF process.
   */
  public async kill() {
    return new Promise<void>((resolve, reject) => {
      if (this.ffProcess != undefined) {
        this.ffProcess.kill();

        this.ffProcess.on("exit", () => {
          resolve();
        });
      }
      else {
        reject("Can't stop FFmpeg when it's not currently running!");
      }
    });
  }

  /**
   * Get path to FFmpeg/probe.
   * If FFmpeg/probe doesn't exist, download it first then return its path.
   */
  public async getPath() {
    const execPath = path.dirname(process.execPath);
    const ffmpegPath = path.join(execPath, FFmpeg.ffmpegExeName);
    const ffprobePath = path.join(execPath, FFmpeg.ffprobeExeName);

    // If ffmpeg or ffprobe does not exist, go download it
    if (!fs.existsSync(ffmpegPath) || !fs.existsSync(ffprobePath)) {
      const winDownloadURL = "https://ul.sbond.co/ffmpeg/ffmpeg-latest-win-amd64.zip";
      const linuxDownloadURL = "https://ul.sbond.co/ffmpeg/ffmpeg-release-linux-amd64.zip";
      const downloadTo = ffmpegPath + '.zip';
      let downloadURL: string;

      // Set downloadURL depending on users platform
      if (process.platform == 'win32') downloadURL = winDownloadURL;
      else if (process.platform == 'linux') downloadURL = linuxDownloadURL;
      else throw new Error('Unsupported platform');

      // Download and extract zip
      await Downloader.get(downloadURL, downloadTo, (progress: Number) => {
        console.log(progress + '%');
      });
      await Downloader.extract(downloadTo, execPath, [FFmpeg.ffmpegExeName, FFmpeg.ffprobeExeName]);

      // Temporary - sleep for 1 second to give enough time for file to be able to be accessed
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Return path to executable
    if (this.which == "ffprobe") {
      return ffprobePath;
    }

    // Return ffmpegPath as default, anything else should be returned above
    return ffmpegPath;
  }
}
