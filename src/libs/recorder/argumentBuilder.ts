import SettingsManager, { SettingsFiles, RecordingSettings } from "../settings";

export default class ArgumentBuilder {
  public static getArgs() {
    // Make sure settings we have are up to date
    SettingsManager.getSettings(SettingsFiles.Recording);

    if (process.platform == "win32" || process.platform == "linux") {
      return ArgumentBuilder.buildArgs();
    }

    throw new Error("Could not build args for currently system. It isn't supported.")
  }

  private static buildArgs(): String {
    let args = new Array<string>();

    // Audio devices
    RecordingSettings.audioDevicesToRecord.forEach(ad => {
      args.push(`-f pulse -i ${ad.sourceNumber}`);
    });

    // Recording FPS
    args.push(`-framerate ${this.fps}`);

    // Recording resolution
    args.push(`-video_size ${this.resolution}`);

    args.push(`-f ${this.videoDevice}`);

    args.push(`-i ${this.recordingRegion}`);

    args.push(`${this.audioMaps}`);

    args.push(`"${this.videoOutputPath}"`);

    return args.join(" ").toString();
  }

  private static get fps(): String {
    return RecordingSettings.fps;
  }

  private static get resolution(): String {
    let res;

    switch (RecordingSettings.resolution)
    {
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

  private static get videoDevice(): String {
    return "x11grab";
  }

  private static get recordingRegion(): String {
    return ":0.0+0,0";
  }

  private static get audioMaps(): String {
    return "";
  }

  private static get videoOutputPath(): String {
    return "";
  }
}
