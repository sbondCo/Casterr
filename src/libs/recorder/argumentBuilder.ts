import DeviceManager from "./deviceManager";
import SettingsManager, { SettingsFiles, RecordingSettings } from "../settings";
import PathHelper from "../helpers/pathHelper";
import "../helpers/extensions";
import * as path from "path";

export default class ArgumentBuilder {
  /**
   * Create FFmpeg arguments.
   * Automatically builds the correct arguments depending on current OS.
   */
  public static async createArgs(): Promise<{
    args: string;
    videoPath: string;
  }> {
    // Make sure settings we have are up to date
    SettingsManager.getSettings(SettingsFiles.Recording);

    // Build and return args differently depending on OS
    if (process.platform == "win32") {
      return await ArgumentBuilder.buildWindowsArgs();
    } else if (process.platform == "linux") {
      return await ArgumentBuilder.buildLinuxArgs();
    }

    throw new Error("Could not build args for current system. It isn't supported.");
  }

  /**
   * Builds FFmpeg arguments for Linux.
   */
  private static async buildLinuxArgs() {
    const args = new Array<string>();

    // Audio devices
    RecordingSettings.audioDevicesToRecord.forEach((ad) => {
      args.push(`-f pulse -i ${ad.ID}`);
    });

    // Recording FPS
    args.push(`-framerate ${this.fps}`);

    // Recording resolution
    args.push(`-video_size ${this.resolution}`);

    // FFmpeg video device
    args.push(`-f ${this.ffmpegDevice}`);

    // Recording region
    args.push(`-i ${await this.recordingRegion()}`);

    // Audio maps
    args.push(`${this.audioMaps}`);

    // Video output path
    const videoOutputPath = this.videoOutputPath;
    args.push(`"${this.videoOutputPath}"`);

    return {
      args: args.join(" ").toString(),
      videoPath: videoOutputPath
    };
  }

  /**
   * Builds FFmpeg arguments for Windows.
   */
  private static async buildWindowsArgs() {
    const args = new Array<string>();

    // Audio devices
    RecordingSettings.audioDevicesToRecord.forEach((ad) => {
      args.push(`-f dshow -i audio="${ad.ID}"`);
    });

    // FFmpeg video device
    args.push(`-f ${this.ffmpegDevice}`);

    // Video device
    if (
      RecordingSettings.videoDevice
        .toLowerCase()
        .equalsAnyOf(["default", "desktop screen", DeviceManager.winDesktopVideoDevice])
    ) {
      args.push(`-i video=${DeviceManager.winDesktopVideoDevice}`);
    } else {
      args.push(`-i video=${RecordingSettings.videoDevice}`);
    }

    // Audio maps
    args.push(`${this.audioMaps}`);

    // Recording FPS
    args.push(`-framerate ${this.fps}`);

    // Recording resolution
    args.push(`-video_size ${this.resolution}`);

    // Recording region
    args.push(`-i ${await this.recordingRegion()}`);

    // Zero Latency
    if (RecordingSettings.zeroLatency) {
      args.push("-tune zerolatency");
    }

    // Ultra Fast
    if (RecordingSettings.ultraFast) {
      args.push("-preset ultrafast");
    }

    // Video output path
    const videoOutputPath = this.videoOutputPath;
    args.push(`"${this.videoOutputPath}"`);

    return {
      args: args.join(" ").toString(),
      videoPath: videoOutputPath
    };
  }

  private static get fps(): string {
    const fps = parseInt(RecordingSettings.fps, 10);

    // If can get number from FPS setting, then use it
    // If not, then just return 30fps as a default
    if (!isNaN(fps)) {
      return fps.toString();
    } else {
      return "30";
    }
  }

  private static get resolution(): string {
    let res;

    switch (RecordingSettings.resolution) {
      case "In-Game":
        throw new Error("In-Game directive not currently supported.");
      case "2160p":
        res = "3840x2160";
        break;
      case "1440p":
        res = "2560x1440";
        break;
      case "1080p":
        res = "1920x1080";
        break;
      case "720p":
        res = "1280x720";
        break;
      case "480p":
        res = "640x480";
        break;
      case "360p":
        res = "480x360";
        break;
      default:
        res = "1920x1080";
        break;
    }

    return res;
  }

  private static get ffmpegDevice(): string {
    if (process.platform == "win32") return "dshow";
    else if (process.platform == "linux") return "x11grab";
    else throw new Error("No video device to fetch for unsupported platform.");
  }

  private static async recordingRegion(): Promise<string> {
    let monitor;
    const monitorToRecord = RecordingSettings.monitorToRecord.toLowerCase();

    // Get monitor
    if (monitorToRecord == "primary") {
      monitor = await DeviceManager.getPrimaryMonitor();
    } else {
      monitor = await DeviceManager.findMonitor(monitorToRecord);
    }

    // Return different format depending on OS
    if (process.platform == "win32") {
      return `-offset_x ${monitor.bounds.x} -offset_y ${monitor.bounds.y}`;
    } else if (process.platform == "linux") {
      return `:0.0+${monitor.bounds.x},${monitor.bounds.y}`;
    } else {
      throw new Error("Can't get recording region for unsupported platform.");
    }
  }

  private static get audioMaps(): string {
    const maps = new Array<string>();
    const audToRec = RecordingSettings.audioDevicesToRecord;

    if (audToRec.length > 0) {
      if (RecordingSettings.seperateAudioTracks) {
        // Make maps so that audio devices are put on separate tracks
        // Add one to length of audToRec to include the one video device
        for (let i = 0, n = audToRec.length + 1; i < n; ++i) {
          maps.push(`-map ${i}`);
        }
      } else {
        // Make maps to put all audio devices onto the same track
        const cap = RecordingSettings.audioDevicesToRecord.length;

        maps.push(`-filter_complex "`);

        for (let i = 0; i < cap; ++i) {
          maps.push(`[${i}:a:0]`);
        }

        maps.push(`amix = ${cap}:longest[aout]"`);
        maps.push(`-map ${cap}:V:0 -map "[aout]"`);
      }
    }

    return maps.join(" ").toString();
  }

  public static get videoOutputName(): string {
    return `${RecordingSettings.videoSaveName.toReadableDateTime()}.${RecordingSettings.format}`;
  }

  private static get videoOutputPath(): string {
    return path.join(PathHelper.ensureExists(RecordingSettings.videoSaveFolder, true), this.videoOutputName);
  }
}
