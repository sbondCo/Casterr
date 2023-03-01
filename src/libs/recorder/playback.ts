/**
 * Past recording functionality.
 */

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
  private static readonly ffmpeg = new FFmpeg();
  private static readonly playbackFile = path.join(
    os.tmpdir(),
    `casterr-playback.${store.getState().settings.recording.format}`
  );

  /**
   * Start recording to the temporary file.
   */
  public static async start() {
    const rs = store.getState().settings.recording;
    if (rs.recordThePast) {
      // Create args
      this.args = await ArgumentBuilder.createArgs();
      this.args.args.pop();
      this.args.args.push(
        `-f segment -segment_time ${
          rs.recordThePast + 10 // Add 10 seconds. Avoid ffmpeg segment having less than needed.
        } -segment_format mp4 -segment_list /tmp/catfile.ffcat -segment_wrap 2 -reset_timestamps 1 /tmp/casterr-segment%d.mp4`
      );
      logger.info("PlaybackRecorder", "Start Args:", this.args.args.join(" "));

      // Start the recording
      await this.ffmpeg.run(this.args.args.join(" "), "onOpen");
    } else {
      logger.info("PlaybackRecorder", "Not starting.. recordThePast setting is not enabled");
    }
  }

  /**
   * Stop recording to the temporary file and remove it.
   */
  public static async stop() {
    try {
      return await Promise.all([
        this.ffmpeg.kill(),
        PathHelper.removeFile("/tmp/catfile.ffcat"),
        PathHelper.removeFile("/tmp/casterr-segment0.mp4"),
        PathHelper.removeFile("/tmp/casterr-segment1.mp4")
      ]);
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
        await ffmpeg.run("-y -i /tmp/catfile.ffcat -map 0 -c copy /tmp/combined.mp4", "onExit");
        const vOut = await ArgumentBuilder.videoOutputPath();
        logger.info("PlaybackRecorder", `Outputting past recording of max ${rs.recordThePast}s to ${vOut}`);
        await ffmpeg.run(`-y -sseof -${rs.recordThePast} -i /tmp/combined.mp4 "${vOut}"`, "onExit");
        PlaybackRecorder.start().catch((e) => {
          logger.error("PlaybackRecorder", "Failed to restart the PlaybackRecorder!", e);
        });
        RecordingsManager.add(vOut).catch((e) => {
          logger.error("PlaybackRecorder", "Failed to add recorded video to file via RecordingsManager!", e);
        });
        PathHelper.removeFile("/tmp/combined.mp4").catch((e) => {
          logger.error("PlaybackRecorder", "Failed to remove temp combined video file:", e);
        });
      } catch (err) {
        logger.error("PlaybackRecorder", "Errored whilst saving past recording:", err);
      }
    } else {
      logger.info("PlaybackRecorder", "Not saving.. recordThePast setting is not enabled");
      Notifications.desktop("Recording The Past is disabled!").catch((err) => {
        logger.error("PlaybackRecorder", "Failed to display disabled notif:", err);
      });
    }
  }
}
