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
    // Create args
    this.args = await ArgumentBuilder.createArgs();
    this.args.args.pop();
    this.args.args.push(
      "-f segment -segment_time 10 -segment_format mp4 -segment_list /tmp/catfile.ffcat -segment_wrap 2 -reset_timestamps 1 /tmp/casterr-segment%d.mp4"
    );
    // this.args.args.push(this.playbackFile);
    logger.info("PlaybackRecorder", "Start Args:", this.args.args.join(" "));

    // Start the recording
    await this.ffmpeg.run(this.args.args.join(" "), "onOpen");
  }

  /**
   * Stop recording to the temporary file and remove it.
   */
  public static async stop() {
    return await this.ffmpeg.kill().catch((err) => {
      logger.error("PlaybackRecorder", "Failed to kill ffmpeg instance", err);
    });
  }

  /**
   * Save chunk from temporary playback file as normal recording.
   */
  public static async save() {
    const rs = store.getState().settings.recording;
    if (rs.recordThePast) {
      const ffmpeg = new FFmpeg();
      await ffmpeg.run("-y -i /tmp/catfile.ffcat -map 0 -c copy /tmp/combined.mp4", "onExit");
      const vOut = await ArgumentBuilder.videoOutputPath();
      await ffmpeg.run(`-y -sseof -${rs.recordThePast} -i /tmp/combined.mp4 ${vOut}`, "onExit");
    } else {
      logger.log("PlaybackRecorder", "Not saving.. recordThePast setting is not enabled");
    }
  }
}
