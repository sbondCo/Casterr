import FFmpeg from "./ffmpeg";

export default class Recorder {
  private static ffmpeg = new FFmpeg();

  public static start() {
    this.ffmpeg.run();
  }

  public static stop() {
    this.ffmpeg.kill();
  }
}
