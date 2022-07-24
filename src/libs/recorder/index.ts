// import FFmpeg from "./ffmpeg";
import ArgumentBuilder, { Arguments } from "./argumentBuilder";
// import RecordingsManager from "./recordingsManager";
import Notifications from "./../helpers/notifications";
import { store } from "@/app/store";
import { areRecording, incrementElapsed } from "./recorderSlice";

export default class Recorder {
  // private static ffmpeg = new FFmpeg();
  private static args: Arguments;
  private static elapsedTimeSI: any;

  /**
   * Start recording.
   */
  public static async start() {
    // Only start recording if not currently doing so
    if (this.isRecording === false) {
      this.isRecording = true;

      // Create args from user's settings
      this.args = await ArgumentBuilder.createArgs();
      console.log(this.args);

      // await this.ffmpeg.run((await this.args).args.toString(), "onOpen");
      Notifications.desktop("Started Recording", "play");
    }
  }

  /**
   * Stop recording.
   */
  public static async stop() {
    this.isRecording = false;
    clearInterval(this.elapsedTimeSI);

    // // Wait for ffmpeg to exit
    // await this.ffmpeg.kill();

    // // Add recording to recordings file
    // RecordingsManager.add((await this.args).videoPath);
  }

  /**
   * Automatically decide whether to start or stop
   * recording depending on if currently recording or not.
   */
  public static async auto() {
    if (!this.isRecording) {
      this.start();
    } else {
      await this.stop();
    }
  }

  /**
   * isRecording getter.
   */
  private static get isRecording() {
    return store.getState().recorder.isRecording;
  }

  /**
   * isRecording setter.
   * Emits recordingStatus event when changed.
   */
  private static set isRecording(recording: boolean) {
    if (recording) {
      this.elapsedTimeSI = setInterval(() => store.dispatch(incrementElapsed()), 1000);
    }

    store.dispatch(areRecording(recording));
  }
}
