import path from "path";
import os from "os";
import { store } from "@/app/store";
import FFmpeg from "./ffmpeg";
import ArgumentBuilder, { type Arguments } from "./argumentBuilder";
import { logger } from "../logger";
import { ipcRenderer } from "electron";
import RecordingsManager from "./recordingsManager";
import PathHelper from "../helpers/pathHelper";
import Notifications from "../helpers/notifications";

ipcRenderer.on("recordThePast-pressed", async () => {
  logger.info("KEYBIND", "Record The Past keybind pressed.. saving.");
  await PlaybackRecorder.save();
});

export default class PlaybackRecorder {
  private static readonly ffmpeg = new FFmpeg();
  private static args: Arguments;
  private static format: string;
  private static isRecording: boolean = false;

  /**
   * Start recording to the temporary file.
   */
  public static async start() {
    if (this.isRecording) {
      logger.info("PlaybackRecorder", "Already recording.. ignoring request to start again.");
      return;
    }
    const rs = store.getState().settings.recording;
    if (rs.recordThePast) {
      this.isRecording = true;
      this.format = rs.format;
      // Create args
      this.args = await ArgumentBuilder.createArgs();
      this.args.args.pop();
      this.args.args.push(
        `-f segment -segment_time ${
          rs.recordThePast + 10 // Add 10 seconds. Avoid ffmpeg segment having less than needed.
        } -segment_format ${
          this.format
        } -segment_list ${this.catPath()} -segment_wrap 2 -reset_timestamps 1 ${path.join(
          os.tmpdir(),
          `casterr-segment%d.${this.format}`
        )}`
      );
      logger.info("PlaybackRecorder", "Start Args:", this.args.args.join(" "));

      // Start the recording
      await this.ffmpeg.run(this.args.args.join(" "), "onOpen");
    } else {
      logger.info("PlaybackRecorder", "Not starting.. recordThePast setting is not enabled");
      Notifications.desktop("Past Recording is disabled!", "info").catch((err) => {
        logger.error("PlaybackRecorder", "Failed to display start disabled notif:", err);
      });
    }
  }

  /**
   * Stop recording to the temporary file and remove it.
   * @param deleteSegments If segment video files should also be deleted.
   */
  public static async stop(deleteSegments = true) {
    try {
      if (!this.isRecording) {
        logger.info("PlaybackRecorder", "Not recording.. ignoring request to stop again.");
        return;
      }
      if (deleteSegments) {
        await Promise.all([
          this.ffmpeg.kill(),
          PathHelper.removeFile(this.catPath()),
          PathHelper.removeFile(path.join(os.tmpdir(), `casterr-segment0.${this.format}`)),
          PathHelper.removeFile(path.join(os.tmpdir(), `casterr-segment1.${this.format}`))
        ]);
      } else {
        await this.ffmpeg.kill();
      }
      this.isRecording = false;
    } catch (err) {
      logger.error("PlaybackRecorder", "Failed to kill ffmpeg instance", err);
    }
  }

  public static async restart() {
    await this.stop();
    await this.start();
  }

  /**
   * Save chunk from temporary playback file as normal recording.
   */
  public static async save() {
    if (!this.isRecording) {
      logger.info("PlaybackRecorder", "Not recording.. ignoring request to save.");
      return;
    }
    const rs = store.getState().settings.recording;
    if (rs.recordThePast) {
      Notifications.desktop("Processing Past Recording!", "info").catch((err) => {
        logger.error("PlaybackRecorder", "Failed to display processing past rec notif:", err);
      });
      try {
        await this.stop(false);
        const ffmpeg = new FFmpeg();
        await ffmpeg.run(`-y -i ${this.catPath()} -map 0 -c copy ${this.combinedPath()}`, "onExit"); // Combine segments
        const vOut = await ArgumentBuilder.videoOutputPath();
        logger.info("PlaybackRecorder", `Outputting past recording of max ${rs.recordThePast}s to ${vOut}`);
        await ffmpeg.run(`-y -sseof -${rs.recordThePast} -i ${this.combinedPath()} "${vOut}"`, "onExit"); // Get $recordThePast seconds from combined video
        PlaybackRecorder.start().catch((e) => {
          logger.error("PlaybackRecorder", "Failed to restart the PlaybackRecorder!", e);
          Notifications.desktop("Failed to Restart Past Recorder!", "error").catch((err) => {
            logger.error("PlaybackRecorder", "Failed to display restart past recorder err notif:", err);
          });
        });
        RecordingsManager.add(vOut).catch((e) => {
          logger.error("PlaybackRecorder", "Failed to add recorded video to file via RecordingsManager!", e);
          Notifications.desktop("Failed To Move Past Recording!", "error").catch((err) => {
            logger.error("PlaybackRecorder", "Failed to display failed to move notif:", err);
          });
        }).then(() => {
          Notifications.desktop("Saved Past Recording!", "play").catch((err) => {
            logger.error("PlaybackRecorder", "Failed to display save notif:", err);
          });
        });
        PathHelper.removeFile(this.combinedPath()).catch((e) => {
          logger.error("PlaybackRecorder", "Failed to remove temp combined video file:", e);
        });
        await this.start();
      } catch (err) {
        logger.error("PlaybackRecorder", "Errored whilst saving past recording:", err);
        Notifications.desktop("Failed to save!", "error").catch((err) => {
          logger.error("PlaybackRecorder", "Failed to display save err notif:", err);
        });
      }
    } else {
      logger.info("PlaybackRecorder", "Not saving.. recordThePast setting is not enabled");
      Notifications.desktop("Past Recording is disabled!", "info").catch((err) => {
        logger.error("PlaybackRecorder", "Failed to display disabled notif:", err);
      });
    }
  }

  private static catPath() {
    return path.join(os.tmpdir(), "catfile.ffcat");
  }

  private static combinedPath() {
    return path.join(os.tmpdir(), `combined.${this.format}`);
  }
}
