import FFmpeg from "./ffmpeg";

export default class Recorder {
  private static ffmpeg = new FFmpeg();
  private static isRecording: Boolean = false;

  /**
   * Start recording
   */
  public static start() {
    // Only start recording if not currently doing so
    if (this.isRecording == false) {
      this.ffmpeg.run("-f x11grab -i :0.0+0,0 /home/sbondo/Videos/Casterr/output.mkv", {
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
  public static stop() {
    this.ffmpeg.kill();
    this.isRecording = false;
  }
}
