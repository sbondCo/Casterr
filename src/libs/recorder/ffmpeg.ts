import path from "path";
import fs from "fs";
import childProcess from "child_process";
import Downloader from "./../helpers/downloader";
import Notifications from "./../helpers/notifications";
import PathHelper from "../helpers/pathHelper";
import Paths from "../helpers/paths";
import { createLogger, format, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export default class FFmpeg {
  /**
   * FFmpeg exe name which is dependent on the user's platform.
   */
  public static get ffmpegExeName() {
    if (process.platform === "win32") {
      return "ffmpeg.exe";
    } else {
      return "ffmpeg";
    }
  }

  /**
   * FFprobe exe name which is dependent on the user's platform.
   */
  public static get ffprobeExeName() {
    if (process.platform === "win32") {
      return "ffprobe.exe";
    } else {
      return "ffprobe";
    }
  }

  // FFmpeg/probe process
  private ffProcess: childProcess.ChildProcess | undefined;
  private readonly logger: Logger;

  constructor(private readonly which: "ffmpeg" | "ffprobe" = "ffmpeg") {
    this.logger = createLogger({
      transports: [
        new DailyRotateFile({
          format: format.printf((info) => {
            const { message, ...meta } = info;
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return `${message} ${meta[Symbol.for("splat")]
              .map((v: any) => (typeof v === "object" ? JSON.stringify(v, undefined, 2) : v))
              .join(" ")}`;
          }),
          filename: path.join(Paths.logsPath, "ff", `${which}-%DATE%.log`),
          datePattern: "YYYY-MM-DD-HH",
          maxFiles: 12
        })
      ]
    });
  }

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
    this.logger.info("FF Process starting:", ffPath);

    return await new Promise((resolve, reject) => {
      // Create child process and send args to it
      this.ffProcess = childProcess.exec(`${ffPath} ${args}`);

      // Run stdoutCallback when recieving stdout
      this.ffProcess.stdout?.on("data", (data) => {
        this.logger.info("FFProcess stdout:", data.toString());
        if (outputs?.stdoutCallback !== undefined) outputs?.stdoutCallback(data);
      });

      // Run stderrCallback when recieving stderr
      this.ffProcess.stderr?.on("data", (data) => {
        this.logger.info("FFProcess stderr:", data.toString());
        if (outputs?.stderrCallback !== undefined) outputs?.stderrCallback(data);
      });

      // When ffProcess exits
      this.ffProcess.on("close", (code) => {
        this.logger.info("FFProcess exited with code", code);
        // Call onExitCallback if set to do so
        if (outputs?.onExitCallback !== undefined) outputs?.onExitCallback(code);

        if (whenToResolve === "onExit") resolve(code);
      });

      if (whenToResolve === "onOpen") resolve("started");
    });
  }

  /**
   * Kill FF process.
   */
  public async kill() {
    return await new Promise((resolve) => {
      if (this.ffProcess !== undefined) {
        // FFmpeg gracefully stops recording when you press q
        this.ffProcess.stdin?.write("q");

        this.ffProcess.on("exit", () => {
          this.ffProcess = undefined;
          resolve("Successfully stopped FFmpeg.");
        });
      } else {
        resolve("FFmpeg not running, nothing to close.");
      }
    });
  }

  /**
   * Get path to FFmpeg/probe.
   * If FFmpeg/probe doesn't exist, download it first then return its path.
   */
  public async getPath() {
    const toolsDir = await PathHelper.ensureExists(Paths.toolsPath, true);

    const { ffmpegPath, ffprobePath } = await this.getFFmpeg(toolsDir);

    // Return path to correct executable depending on 'which' constructor arg
    if (this.which === "ffprobe") return ffprobePath;
    else return ffmpegPath;
  }

  /**
   * Get FFmpeg/FFprobe paths. If they don't exist, download them first.
   * @param installDir Directory to install FFmpeg/probe.
   * @returns FFmpeg and FFprobe paths.
   */
  private async getFFmpeg(installDir: string): Promise<{ ffmpegPath: string; ffprobePath: string }> {
    const downloader = new Downloader();
    const ffmpegPath = path.join(installDir, FFmpeg.ffmpegExeName);
    const ffprobePath = path.join(installDir, FFmpeg.ffprobeExeName);

    // If ffmpeg or ffprobe does not exist, go download it
    if (!fs.existsSync(ffmpegPath) || !fs.existsSync(ffprobePath)) {
      const popupId = "ffmpegDownloadProgress";
      const downloadTo = ffmpegPath + ".zip";
      let dlURL: string;

      // Set downloadURL depending on users platform
      if (process.platform === "win32") {
        dlURL = "https://api.github.com/repos/sbondCo/Casterr-Resources/releases/assets/34421932";
      } else if (process.platform === "linux") {
        dlURL = "https://api.github.com/repos/sbondCo/Casterr-Resources/releases/assets/34421938";
      } else {
        throw new Error("Unsupported platform");
      }

      // Download zip
      downloader.accept = "application/octet-stream";
      await downloader.get(dlURL, downloadTo, (progress) => {
        // Keep updating popup with new progress %
        Notifications.popup({ id: popupId, title: "Fetching Recording Utilities", percentage: progress }).catch((e) => {
          this.logger.error(`Failed to update ${popupId} popup with progress.`, e);
        });
      });

      // Update popup to extracting phase
      Notifications.popup({ id: popupId, title: "Fetching Recording Utilities" }).catch((e) =>
        this.logger.error(`Failed to update ${popupId} popup with new title (Going on to utilities phase)`, e)
      );

      // Extract zip
      await PathHelper.extract(downloadTo, installDir, [FFmpeg.ffmpegExeName, FFmpeg.ffprobeExeName]);

      // Delete popup
      Notifications.rmPopup(popupId);

      // Temporary - sleep for 1 second to give enough time for file to be able to be accessed
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Make sure screen-capture-recorder is installed, for windows machines.
    if (process.platform === "win32") await this.getSCR(installDir);

    // Get exec perms for ff binaries.
    // Do this even if we didn't just download them so there
    // is no reason for it to fail with 'no perms' error.
    fs.chmodSync(ffmpegPath, 0o111);
    fs.chmodSync(ffprobePath, 0o111);

    return { ffmpegPath, ffprobePath };
  }

  /**
   * Make sure screen-capture-recorder and virtual-audio-capturer are installed.
   */
  private async getSCR(installDir: string) {
    const dlls = ["screen-capture-recorder-x64.dll", "virtual-audio-capturer-x64.dll"];

    // Don't run if dlls already installed.
    // Currently this is only checking if the dll exists in the tools folder.
    if (fs.existsSync(path.join(installDir, dlls[0])) && fs.existsSync(path.join(installDir, dlls[1]))) {
      return;
    }

    const downloader = new Downloader();
    const dlURL = "https://api.github.com/repos/sbondCo/Casterr-Resources/releases/assets/34421931";
    const dlTo = path.join(installDir, "scr-vac.zip");
    const popupId = "scrDownloadProgress";

    // Download zip
    downloader.accept = "application/octet-stream";
    await downloader.get(dlURL, dlTo, (progress) => {
      // Keep updating popup with new progress %
      Notifications.popup({ id: popupId, title: "Fetching Recording Devices", percentage: progress }).catch((e) =>
        this.logger.error(`Failed to update ${popupId} popup with new progress`, e)
      );
    });

    // Extract
    Notifications.popup({ id: popupId, title: "Extracting Recording Devices" }).catch((e) =>
      this.logger.error(`Failed to update ${popupId} popup with new title (Going on to extracting phase)`, e)
    );
    await PathHelper.extract(dlTo, installDir, dlls);

    // Register as service
    await new Promise((resolve, reject) => {
      const cmd = `regsvr32 /s "${path.join(installDir, dlls[0])}" "${path.join(installDir, dlls[1])}"`;
      const registerProcess = childProcess.exec(
        `powershell -command "Start-Process PowerShell -Verb RunAs -WindowStyle Hidden -PassThru -Wait -ArgumentList '${cmd}'"`
      );

      registerProcess.on("exit", (code) => {
        if (code === 0) {
          resolve("registerProcess successful.");
        } else {
          reject(new Error("registerProcess failed."));
        }
      });
    });

    Notifications.rmPopup(popupId);
  }
}
