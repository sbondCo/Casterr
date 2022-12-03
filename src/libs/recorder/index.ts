import FFmpeg from "./ffmpeg";
import ArgumentBuilder, { Arguments } from "./argumentBuilder";
import RecordingsManager from "./recordingsManager";
import Notifications from "./../helpers/notifications";
import { store } from "@/app/store";
import { isRecording } from "./recorderSlice";

export default class Recorder {
  private static ffmpeg = new FFmpeg();
  private static args: Arguments;

  /**
   * Start recording.
   */
  public static async start() {
    try {
      // If already recording, return before doing anything
      if (store.getState().recorder.isRecording === true) {
        console.log("Recorder.start called, but already recording. Ignoring..");
        return;
      }

      store.dispatch(isRecording(true));

      // Create args from user's settings
      this.args = await ArgumentBuilder.createArgs();
      console.log("Recorder.Start Args:", this.args);

      // Start the recording
      await this.ffmpeg.run(this.args.args, "onOpen");

      Notifications.desktop("Started Recording", "play");
    } catch (err) {
      console.error("Couldn't start recording:", err);
      store.dispatch(isRecording(false));
    }
  }

  /**
   * Stop recording.
   */
  public static async stop() {
    // If not recording ignore
    if (store.getState().recorder.isRecording === false) {
      console.log("Recorder.stop called, but not recording. Ignoring..");
      return;
    }

    store.dispatch(isRecording(false));

    // Wait for ffmpeg to exit
    await this.ffmpeg.kill();

    // Add recording to recordings file
    if (this.args?.videoPath) RecordingsManager.add(this.args.videoPath);
    else
      console.error(
        "Couldn't add recorded video via RecordingsManager to pastRecordings. args.videoPath not defined:",
        this.args
      );
  }

  /**
   * Automatically decide whether to start or stop
   * recording depending on if currently recording or not.
   */
  public static async auto() {
    if (!store.getState().recorder.isRecording) {
      this.start();
    } else {
      await this.stop();
    }
  }
}
