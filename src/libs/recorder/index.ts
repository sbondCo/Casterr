import FFmpeg from "./ffmpeg";
import ArgumentBuilder, { type CustomRegion, type Arguments } from "./argumentBuilder";
import RecordingsManager from "./recordingsManager";
import Notifications from "./../helpers/notifications";
import { store } from "@/app/store";
import { addBookmarkToRecording, setRecordingStatus } from "./recorderSlice";
import { ipcRenderer } from "electron";
import { logger } from "../logger";

ipcRenderer.on("startStopRecording-pressed", async () => {
  await Recorder.auto(undefined);
});

ipcRenderer.on("startStopRecordingRegion-pressed", async () => {
  const b = await ipcRenderer.invoke("select-region-win");
  logger.info("Recorder", "Region selected", b);
  await Recorder.auto(b);
});

ipcRenderer.on("addBookmark-pressed", async () => {
  if (store.getState().recorder.recordingStatus !== 1) {
    console.log("can't add bookmark when not recording");
    return;
  }
  store.dispatch(addBookmarkToRecording());
});

export default class Recorder {
  private static readonly ffmpeg = new FFmpeg();
  private static args: Arguments;

  /**
   * Start recording.
   */
  public static async start(customRegion: CustomRegion) {
    try {
      // If already recording, return before doing anything
      if (store.getState().recorder.recordingStatus !== 0) {
        logger.info("Recorder", "Recorder.start called, but already recording. Ignoring..");
        return;
      }

      store.dispatch(setRecordingStatus(2));

      // Create args from user's settings
      const ab = new ArgumentBuilder(customRegion);
      this.args = await ab.createArgs();
      logger.info("Recorder", "Recorder.Start Args:", this.args);

      // Start the recording
      await this.ffmpeg.run(this.args.args, "onOpen");

      store.dispatch(setRecordingStatus(1));

      Notifications.desktop("Started Recording", "play").catch((e) =>
        logger.error("Recorder", "Failed to show started recording desktop notification", e)
      );
    } catch (err) {
      logger.error("Recorder", "Couldn't start recording:", err);
      store.dispatch(setRecordingStatus(0));
    }
  }

  /**
   * Stop recording.
   */
  public static async stop() {
    // If not recording ignore
    if (store.getState().recorder.recordingStatus !== 1) {
      logger.info("Recorder", "Recorder.stop called, but not recording. Ignoring..");
      return;
    }

    store.dispatch(setRecordingStatus(0));

    // Wait for ffmpeg to exit
    await this.ffmpeg.kill();

    // Add recording to recordings file
    if (this.args?.videoPath) {
      RecordingsManager.add(this.args.videoPath).catch((e) => {
        logger.error(
          "Recorder",
          "Failed to add recorded video to file via RecordingsManager! If you are seeing this error, your recording should be safe and accessible in your normal recordings folder, you can try dragging it back into the app to get it to show here.",
          e
        );
      });
    } else {
      logger.error(
        "Recorder",
        "Couldn't add recorded video via RecordingsManager to pastRecordings. args.videoPath not defined:",
        this.args
      );
    }
  }

  /**
   * Automatically decide whether to start or stop
   * recording depending on if currently recording or not.
   */
  public static async auto(customRegion: CustomRegion) {
    if (store.getState().recorder.recordingStatus === 0) {
      await this.start(customRegion);
    } else {
      await this.stop();
    }
  }
}
