import FFmpeg from "./ffmpeg";
import ArgumentBuilder from "./argumentBuilder";
import RecordingsManager from "./recordingsManager";
import Notifications from "./../helpers/notifications";
import * as events from "events";

export default class Recorder {
  private static ffmpeg = new FFmpeg();
  private static args: ReturnType<typeof ArgumentBuilder.createArgs>;
  private static _isRecording: boolean = false;
  public static readonly recordingStatus = new events.EventEmitter();

  /**
   * Start recording.
   */
  public static start() {
    // Create args from user's settings
    this.args = ArgumentBuilder.createArgs();

    // Only start recording if not currently doing so
    if (this.isRecording == false) {
      this.ffmpeg.run(this.args.args.toString());
      this.isRecording = true;

      Notifications.desktop("Started Recording", "play");
    }
  }

  /**
   * Stop recording.
   */
  public static async stop() {
    this.isRecording = false;

    // Wait for ffmpeg to exit
    await this.ffmpeg.kill();

    // Add recording to pastRecordings
    RecordingsManager.add(this.args.videoPath);
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
    return this._isRecording;
  }

  /**
   * isRecording setter.
   * Emits recordingStatus event when changed.
   */
  private static set isRecording(recording: boolean) {
    // Only emit event if isRecording value has actually changed
    if (this.isRecording != recording) {
      this.recordingStatus.emit("changed", recording);
    }

    this._isRecording = recording;
  }
}
