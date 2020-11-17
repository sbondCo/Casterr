export default class FFmpeg {
  constructor(private which = "ffmpeg") {

  }

  public run() {
    // Get FFmpeg path
    var ffPath = this.getPath();
  }

  public getPath() {
    console.log(process.execPath);
  }
}
