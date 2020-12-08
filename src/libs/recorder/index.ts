import FFmpeg from "./ffmpeg";
import ArgumentBuilder from "./argumentBuilder";
import RecordingsManager from "./recordingsManager";
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
      this.ffmpeg.run(this.args.args.toString(), {
        stderrCallback: (err: string) => {
          console.log(err);
        }
      });

      this.isRecording = true;
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
      this.recordingStatus.emit('changed', recording);
    }

    this._isRecording = recording;
  }
}
