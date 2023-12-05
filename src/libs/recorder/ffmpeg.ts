import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import childProcess from "child_process";
import Downloader from "./../helpers/downloader";
import Notifications from "./../helpers/notifications";
import PathHelper from "../helpers/pathHelper";
import Paths from "../helpers/paths";
import { createLogger, format, type Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import axios from "axios";

// Control the target version of ffmpeg.
// When we want to update ffmpeg version, new casterr release
// will increment this and make user download.
const targetFFVersion = "2";

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
            // @ts-expect-error Keeps saying cant use type 'symbol' as an index type.. not sure why
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
    return;
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
    const versionsPath = path.join(installDir, ".version");

    this.logger.debug("getFFMPEG", ffmpegPath, ffprobePath);
    // Do this only once
    // Check if we are on targetFFVersion, if not, check latest release to see if we can upgrade.
    const rmff = async () => {
      try {
        this.logger.info("ff being removed.. new version will be downloaded");
        await PathHelper.removeFile(ffmpegPath);
        await PathHelper.removeFile(ffprobePath);
        this.logger.info("ff successfully removed");
      } catch (err) {
        this.logger.error("failed to remove ff!", err);
      }
    };
    try {
      this.logger.info("getFFMPEG2");
      const versions = await fsp.readFile(versionsPath);
      this.logger.info("Current versions", String(versions));
      const v = JSON.parse(String(versions));
      if (v.ffmpeg !== targetFFVersion) {
        await rmff();
      }
    } catch (err: any) {
      if (err.code === "ENOENT") {
        this.logger.info("no versions file, continuing to remove ff");
        await rmff();
      } else {
        this.logger.error("Failed to version check ffmpeg", err);
      }
    }

    // If ffmpeg or ffprobe does not exist, go download it
    if (!fs.existsSync(ffmpegPath) || !fs.existsSync(ffprobePath)) {
      const popupId = "ffmpegDownloadProgress";
      const downloadTo = ffmpegPath + ".zip";
      const dlURL = await this.getResourceDownloadURL("ffmpeg", targetFFVersion);

      // Download zip
      downloader.accept = "application/octet-stream";
      await downloader.get(dlURL.url, downloadTo, (progress) => {
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

      await fsp.writeFile(versionsPath, JSON.stringify(dlURL.body));

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
   * https://github.com/rdp/screen-capture-recorder-to-video-windows-free
   * redist: https://github.com/rdp/screen-capture-recorder-to-video-windows-free/tree/master/vendor
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

  /**
   * Get resouce download url from latest github release if matching wanted version.
   * @param re Resource type.
   * @param v Version wanted.
   * @returns download url.
   */
  private async getResourceDownloadURL(
    re: "ffmpeg" | "screen-capture-utils",
    v: string
  ): Promise<{ url: string; body: object }> {
    const r = await axios.get("https://api.github.com/repos/sbondCo/Casterr-Resources/releases/latest");
    if (r.status !== 200) {
      throw new Error("request failed");
    }
    const releaseBody = JSON.parse(r.data.body);
    if (releaseBody[re] !== v) {
      throw new Error("latest release is not of version wanted");
    }
    const assetName = `${re === "ffmpeg" ? `ffmpeg-${process.platform === "win32" ? "windows" : "linux"}` : re}.zip`;
    const asset = r.data.assets?.find((a: any) => a?.name === assetName);
    if (!asset?.url) {
      throw new Error("failed to find related asset with name:" + assetName);
    }
    return { url: asset.url as string, body: releaseBody };
  }
}
