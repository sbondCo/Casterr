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
  private static args: Arguments;
  private static format: string;
  private static isRecording: boolean = false;
  private static readonly ffmpeg = new FFmpeg();

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
        } -segment_list /tmp/catfile.ffcat -segment_wrap 2 -reset_timestamps 1 /tmp/casterr-segment%d.${this.format}`
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
   */
  public static async stop() {
    try {
      if (!this.isRecording) {
        logger.info("PlaybackRecorder", "Not recording.. ignoring request to stop again.");
        return;
      }
      await Promise.all([
        this.ffmpeg.kill(),
        PathHelper.removeFile("/tmp/catfile.ffcat"),
        PathHelper.removeFile(`/tmp/casterr-segment0.${this.format}`),
        PathHelper.removeFile(`/tmp/casterr-segment1.${this.format}`)
      ]);
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
    const rs = store.getState().settings.recording;
    if (rs.recordThePast) {
      try {
        await this.ffmpeg.kill();
        const ffmpeg = new FFmpeg();
        await ffmpeg.run(`-y -i /tmp/catfile.ffcat -map 0 -c copy /tmp/combined.${this.format}`, "onExit");
        const vOut = await ArgumentBuilder.videoOutputPath();
        logger.info("PlaybackRecorder", `Outputting past recording of max ${rs.recordThePast}s to ${vOut}`);
        await ffmpeg.run(`-y -sseof -${rs.recordThePast} -i /tmp/combined.${this.format} "${vOut}"`, "onExit");
        PlaybackRecorder.start().catch((e) => {
          logger.error("PlaybackRecorder", "Failed to restart the PlaybackRecorder!", e);
        });
        RecordingsManager.add(vOut).catch((e) => {
          logger.error("PlaybackRecorder", "Failed to add recorded video to file via RecordingsManager!", e);
        });
        PathHelper.removeFile(`/tmp/combined.${this.format}`).catch((e) => {
          logger.error("PlaybackRecorder", "Failed to remove temp combined video file:", e);
        });
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
}
