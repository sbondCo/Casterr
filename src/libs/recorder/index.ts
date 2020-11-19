import FFmpeg from "./ffmpeg";

export default class Recorder {
  private static ffmpeg = new FFmpeg();
  private static isRecording: Boolean = false;

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

  public static stop() {
    this.ffmpeg.kill();
    this.isRecording = false;
  }
}
