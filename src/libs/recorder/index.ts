import FFmpeg from "./ffmpeg";

export default class Recorder {
  private static ffmpeg = new FFmpeg();

  public static start() {
    this.ffmpeg.run("-f x11grab -i :0.0+0,0 /home/sbondo/Videos/Casterr/output.mkv", {
      stderrCallback: (err: string) => {
        console.log(err);
      }
    });
  }

  public static stop() {
    this.ffmpeg.kill();
  }
}
