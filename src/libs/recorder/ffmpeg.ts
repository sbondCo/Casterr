import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";
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

  private ffProcess: childProcess.ChildProcess; 

  public async run() {
    // Get FFmpeg path
    var ffPath = await this.getPath();

    // Get exec perms for ff binary
    fs.chmodSync(ffPath, 0o111);

    this.ffProcess = childProcess.exec(`${ffPath} -f x11grab -i :0.0+0,0 /home/sbondo/Videos/Casterr/output.mkv`);

    this.ffProcess.stdout!.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    this.ffProcess.stderr!.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    
    this.ffProcess.on('close', (code) => {
      console.log(`ffmpeg exited with code ${code}`);
    });
  }

  public async kill() {
    if (this.ffProcess != undefined) this.ffProcess.kill();
  }

  public async getPath() {
    let execPath = path.dirname(process.execPath);
    let ffmpegPath = path.join(execPath, FFmpeg.ffmpegExeName);
    let ffprobePath = path.join(execPath, FFmpeg.ffprobeExeName);

    // If ffmpeg or ffprobe does not exist, go download it
    if (!fs.existsSync(ffmpegPath) || !fs.existsSync(ffprobePath)) {
      let winDownloadURL = "https://ul.sbond.co/ffmpeg/ffmpeg-latest-win-amd64.zip";
      let linuxDownloadURL = "https://ul.sbond.co/ffmpeg/ffmpeg-release-linux-amd64.zip";
      let downloadURL: string;
      let downloadTo = ffmpegPath + '.zip';

      if (process.platform == 'win32') downloadURL = winDownloadURL;
      else if (process.platform == 'linux') downloadURL = linuxDownloadURL;
      else throw new Error('Unsupported platform');

      // Download and extract zip
      await Downloader.get(downloadURL, downloadTo, (progress: Number) => {
        console.log(progress + '%');
      });
      await Downloader.extract(downloadTo, execPath, [FFmpeg.ffmpegExeName, FFmpeg.ffprobeExeName]);

      // Temporary - sleep for 1 second to give enough time for file to be able to be accessed
      await new Promise(resolve => setTimeout(resolve, 1000));
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
