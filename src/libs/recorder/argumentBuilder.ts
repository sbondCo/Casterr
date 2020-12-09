import SettingsManager, { SettingsFiles, RecordingSettings } from "../settings";
import PathHelper from "../helpers/pathHelper";
import "../helpers/extensions";
import * as path from "path";

export default class ArgumentBuilder {
  public static createArgs(): {
    args: string,
    videoPath: string;
  } {
    // Make sure settings we have are up to date
    SettingsManager.getSettings(SettingsFiles.Recording);

    // Build and return args differently depending on OS
    if (process.platform == "win32") return ArgumentBuilder.buildWindowsArgs();
    else if (process.platform == "linux") return ArgumentBuilder.buildLinuxArgs();

    throw new Error("Could not build args for currently system. It isn't supported.");
  }

  private static buildLinuxArgs() {
    const args = new Array<string>();

    // Audio devices
    RecordingSettings.audioDevicesToRecord.forEach(ad => {
      args.push(`-f pulse -i ${ad.sourceNumber}`);
    });

    // Recording FPS
    args.push(`-framerate ${this.fps}`);

    // Recording resolution
    args.push(`-video_size ${this.resolution}`);

    // FFmpeg video device
    args.push(`-f ${this.ffmpegDevice}`);

    // Recording region
    args.push(`-i ${this.recordingRegion}`);

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

  private static buildWindowsArgs() {
    const args = new Array<string>();

    // Audio devices
    RecordingSettings.audioDevicesToRecord.forEach(ad => {
      args.push(`-f dshow -i audio="${ad.name}"`);
    });

    // FFmpeg video device
    args.push(`-f ${this.ffmpegDevice}`);

    // Video device
    if (RecordingSettings.videoDevice.toLowerCase().equalsAnyOf(["default", "desktop screen", "screen-capture-recorder"])) {
      args.push("-i video=screen-capture-recorder");
    } else {
      args.push(`-i video=${RecordingSettings.videoDevice}`);
    }

    // Audio maps
    args.push(`${this.audioMaps}`);

    // Recording FPS
    args.push(`-framerate ${this.fps}`);

    // Recording resolution
    args.push(`-video_size ${this.resolution}`);

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

  private static get recordingRegion(): String {
    return ":0.0+0,0";
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

  private static get videoOutputPath(): string {
    return path.join(
      PathHelper.ensureExists(RecordingSettings.videoSaveFolder, true),
      `${RecordingSettings.videoSaveName.toReadableDateTime()}.${RecordingSettings.format}`
    );
  }
}
