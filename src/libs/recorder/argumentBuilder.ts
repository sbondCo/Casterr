import DeviceManager from "./deviceManager";
import PathHelper from "../helpers/pathHelper";
import Registry from "../helpers/registry";
import path from "path";
import { store } from "@/app/store";
import type { RecordingSettings } from "@/settings/types";
import { equalsAnyOf, toReadableDateTime } from "../helpers/extensions/string";
import { toHexTwosComplement } from "../helpers/extensions/number";

export type CustomRegion = { x: number; y: number; height: number; width: number } | undefined;

export interface Arguments {
  args: string;
  videoPath: string;
}

export default class ArgumentBuilder {
  private static readonly scrRegistry = new Registry("HKCU\\Software\\screen-capture-recorder");

  private static get rs(): RecordingSettings {
    return store.getState().settings.recording;
  }

  constructor(private readonly customRegion: CustomRegion) {}

  private bounds: CustomRegion;

  /**
   * Create FFmpeg arguments.
   * Automatically builds the correct arguments depending on current OS.
   */
  public async createArgs(): Promise<Arguments> {
    if (this.customRegion) {
      this.bounds = this.customRegion;
    } else {
      const monitorToRecord = ArgumentBuilder.rs.monitorToRecord.id.toLowerCase();
      // Get monitor
      if (monitorToRecord === "primary") {
        this.bounds = (await DeviceManager.getPrimaryMonitor()).bounds;
      } else {
        this.bounds = (await DeviceManager.findMonitor(monitorToRecord)).bounds;
      }
    }

    // Build and return args differently depending on OS
    if (process.platform === "win32") {
      return await this.buildWindowsArgs();
    } else if (process.platform === "linux") {
      return await this.buildLinuxArgs();
    }

    throw new Error("Could not build args for current system. It isn't supported.");
  }

  /**
   * Builds FFmpeg arguments for Linux.
   */
  private async buildLinuxArgs() {
    const args = new Array<string>();

    // Audio devices
    ArgumentBuilder.rs.audioDevicesToRecord.forEach((ad) => {
      args.push(`-f pulse -i ${ad}`);
    });

    // Recording FPS
    args.push(`-framerate ${ArgumentBuilder.fps}`);

    // Recording resolution
    args.push(`-video_size ${await this.resolution()}`);

    // FFmpeg video device
    args.push(`-f ${ArgumentBuilder.ffmpegDevice}`);

    // Recording region
    args.push(`-i ${await this.recordingRegion()}`);

    if (ArgumentBuilder.rs.resolution !== "disabled") {
      args.push(this.recordingScale());
    }

    // Audio maps
    args.push(`${ArgumentBuilder.audioMaps}`);

    if (ArgumentBuilder.rs.hardwareEncoding) {
      args.push(`-c:v h264_nvenc -profile high444p -pixel_format yuv444p -preset lossless`);
    }

    // Video output path
    const videoOutputPath = await ArgumentBuilder.videoOutputPath();
    args.push(`"${videoOutputPath}"`);

    return {
      args: args.join(" ").toString(),
      videoPath: videoOutputPath
    };
  }

  /**
   * Builds FFmpeg arguments for Windows.
   */
  private async buildWindowsArgs() {
    const args = new Array<string>();

    // Audio devices
    ArgumentBuilder.rs.audioDevicesToRecord.forEach((ad) => {
      args.push(`-f dshow -i audio="${ad}"`);
    });

    // FFmpeg video device
    args.push(`-f ${ArgumentBuilder.ffmpegDevice}`);

    // Video device
    if (
      equalsAnyOf(ArgumentBuilder.rs.videoDevice.toLowerCase(), [
        "default",
        "desktop screen",
        DeviceManager.winDesktopVideoDevice
      ])
    ) {
      args.push(`-i video=${DeviceManager.winDesktopVideoDevice}`);
    } else {
      args.push(`-i video=${ArgumentBuilder.rs.videoDevice}`);
    }

    // Audio maps
    args.push(`${ArgumentBuilder.audioMaps}`);

    // Recording FPS
    args.push(`-framerate ${ArgumentBuilder.fps}`);

    // Recording resolution
    await this.resolution();

    // Recording region
    await this.recordingRegion();

    // Zero Latency
    if (ArgumentBuilder.rs.zeroLatency) {
      args.push("-tune zerolatency");
    }

    // Ultra Fast
    if (ArgumentBuilder.rs.ultraFast) {
      args.push("-preset ultrafast");
    }

    // Video output path
    const videoOutputPath = await ArgumentBuilder.videoOutputPath();
    args.push(`"${videoOutputPath}"`);

    return {
      args: args.join(" ").toString(),
      videoPath: videoOutputPath
    };
  }

  private static get fps(): string {
    // If can get number from FPS setting, then use it
    // If not, then just return 30fps as a default
    if (!isNaN(this.rs.fps)) {
      return this.rs.fps.toString();
    } else {
      return "30";
    }
  }

  private async resolution(): Promise<string> {
    if (!this.bounds) {
      throw new Error("Failed to get recording WxH bounds");
    }

    if (process.platform === "win32") {
      await ArgumentBuilder.scrRegistry.add("capture_width", this.bounds.width, "REG_DWORD");
      await ArgumentBuilder.scrRegistry.add("capture_height", this.bounds.height, "REG_DWORD");
    }

    return `${this.bounds.width}x${this.bounds.height}`;
  }

  private static get ffmpegDevice(): string {
    if (process.platform === "win32") return "dshow";
    else if (process.platform === "linux") return "x11grab";
    else throw new Error("No video device to fetch for unsupported platform.");
  }

  private async recordingRegion(): Promise<string> {
    if (!this.bounds) {
      throw new Error("Failed to get recording region bounds");
    }

    // Return different format depending on OS
    if (process.platform === "win32") {
      await ArgumentBuilder.scrRegistry.add("start_x", `0x${toHexTwosComplement(this.bounds.x)}`, "REG_DWORD");
      await ArgumentBuilder.scrRegistry.add("start_y", `0x${toHexTwosComplement(this.bounds.y)}`, "REG_DWORD");

      // Return offsets as string anyway
      return `-offset_x ${this.bounds.x} -offset_y ${this.bounds.y}`;
    } else if (process.platform === "linux") {
      return `:0.0+${this.bounds.x},${this.bounds.y}`;
    } else {
      throw new Error("Can't get recording region for unsupported platform.");
    }
  }

  private recordingScale(): string {
    const rscale = ArgumentBuilder.rs.resolution;
    if (rscale === "disabled") return "";
    const res = { width: 0, height: 0 };
    if (rscale === "custom") {
      const customScale = ArgumentBuilder.rs.resolutionCustom;
      if (!customScale?.width || !customScale?.height) {
        throw new Error("Resolution is set to 'custom', but custom resolution setting if not defined!");
      }
      res.width = customScale.width;
      res.height = customScale.height;
    } else {
      switch (rscale) {
        case "2160p":
          res.width = 3840;
          res.height = 2160;
          break;
        case "1440p":
          res.width = 2560;
          res.height = 1440;
          break;
        case "1080p":
          res.width = 1920;
          res.height = 1080;
          break;
        case "720p":
          res.width = 1280;
          res.height = 720;
          break;
        case "480p":
          res.width = 640;
          res.height = 480;
          break;
        case "360p":
          res.width = 480;
          res.height = 360;
          break;
      }
    }
    return `-vf scale=${res.width}:${ArgumentBuilder.rs.resolutionKeepAspectRatio ? "-1" : res.height}`;
  }

  private static get audioMaps(): string {
    const maps = new Array<string>();
    const audToRec = this.rs.audioDevicesToRecord;

    if (audToRec.length > 0) {
      if (this.rs.seperateAudioTracks) {
        // Make maps so that audio devices are put on separate tracks
        // Add one to length of audToRec to include the one video device
        for (let i = 0, n = audToRec.length + 1; i < n; ++i) {
          maps.push(`-map ${i}`);
        }
      } else {
        // Make maps to put all audio devices onto the same track
        const cap = this.rs.audioDevicesToRecord.length;

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
    return `${toReadableDateTime(this.rs.videoSaveName)}.${this.rs.format}`;
  }

  private static async videoOutputPath(): Promise<string> {
    return path.join(await PathHelper.ensureExists(this.rs.videoSaveFolder, true), this.videoOutputName);
  }
}
