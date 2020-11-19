import * as path from "path";
import * as fs from "fs";
import Downloader from "./../helpers/downloader";

export default class FFmpeg {
  constructor(private which = "ffmpeg") {

  }

  public static get ffmpegExeName() {
    if (process.platform == 'win32') {
      return "ffmpeg.exe"
    }
    else {
      return "ffmpeg"
    }
  }

  public static get ffprobeExeName() {
    if (process.platform == 'win32') {
      return "ffprobe.exe"
    }
    else {
      return "ffprobe"
    }
  }

  public run() {
    // Get FFmpeg path
    var ffPath = this.getPath();
  }

  public async getPath() {
    let execPath = path.dirname(process.execPath);
    let ffmpegPath = path.join(execPath, FFmpeg.ffmpegExeName);
    let ffprobePath = path.join(execPath, FFmpeg.ffprobeExeName);

    // If ffmpeg or ffprobe does not exist, go download it
    if (!fs.existsSync(ffmpegPath) || !fs.existsSync(ffprobePath)) {
      let downloadTo = ffmpegPath + '.zip';
      await Downloader.get("https://ul.sbond.co/ffmpeg/ffmpeg-release-linux-amd64.zip", downloadTo);
      await Downloader.extract(downloadTo, execPath);
      console.log("DONE");
    }

    // Return path to executable
    if (this.which == "ffprobe")
    {
      return ffprobePath;
    }
    
    // Always return ffmpegPath, unless something gets returned in if statement above
    return ffmpegPath;
  }
}
