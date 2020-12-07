import FFmpeg from "./ffmpeg";
import ArgumentBuilder from "./argumentBuilder";
import RecordingsManager from "./recordingsManager";

export default class Recorder {
  private static ffmpeg = new FFmpeg();
  private static isRecording: Boolean = false;
  private static args: ReturnType<typeof ArgumentBuilder.createArgs>;

  /**
   * Start recording
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
   * Stop recording
   */
  public static async stop() {
    this.isRecording = false;

    // Wait for ffmpeg to exit
    await this.ffmpeg.kill();

    // Add recording to pastRecordings
    RecordingsManager.add(this.args.videoPath);
  }
}
