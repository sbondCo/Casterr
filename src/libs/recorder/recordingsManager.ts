import FFmpeg from "./ffmpeg";
import PathHelper from "./../helpers/pathHelper";
import { RecordingSettings } from "./../settings";
import * as fs from "fs";
import * as path from "path";

export interface Recording {
  videoPath: string;
  thumbPath: string | undefined;
  fileSize: number | undefined;
  fps: string | undefined;
  duration: number | undefined;
}

export default class RecordingsManager {
  /**
   * Get all user's past recordings.
   */
  public static get(): Array<Recording> {
    const recordings = new Array<Recording>();

    // Get all pastRecordings from json file
    const data = fs.readFileSync(PathHelper.getFile("PastRecordings.json"), "utf8");

    // Parse JSON from file and assign it to recordings variable.
    // Because it is stored in a way so that we don't have to read the file
    // before writing to it, we need to prepare the data in the file before it is parsable JSON.
    // 1. Make into array by wrapping [square brackets] around it.
    // 2. If last letter in data is a ',' then remove it.
    Object.assign(recordings, JSON.parse(`[${data.slice(-1) == "," ? data.slice(0, -1) : data}]`));

    return recordings.reverse();
  }

  /**
   * Add video to user's PastRecordings file
   * @param videoPath Path to video that should be added
   */
  public static async add(videoPath: string): Promise<void> {
    // Throw exception if video from videoPath does not exist
    if (!fs.existsSync(videoPath)) throw new Error("Can't add recording that doesn't exist!");

    const ffprobe = new FFmpeg("ffprobe");
    const recording = {} as Recording;

    recording.videoPath = videoPath;
    recording.thumbPath = this.createThumbnail(videoPath);
    recording.fileSize = fs.statSync(videoPath).size;

    // Get video info from ffprobe
    ffprobe.run(
      `-v error -select_streams v:0 -show_entries format=duration:stream=avg_frame_rate -of default=noprint_wrappers=1 "${videoPath}"`,
      {
        stdoutCallback: (out: string) => {
          // Loop over each line in response from ffprobe, removing empty lines
          out
            .toLowerCase()
            .split(/\r\n|\r|\n/g)
            .filter((l) => l !== "")
            .forEach((l: string) => {
              // Get framerate
              if (l.includes("avg_frame_rate=")) {
                // Framerate is returned like: '60/1', '30/1', '30000/1001', etc
                // We need to do the math to get the framerate to avoid
                // returning something like 30000, so split the response by the slash
                const fps = l.replace("avg_frame_rate=", "").split("/");

                // If fps array has more than 1 items, then divide
                // the first by the second and round to nearest whole number
                if (fps.length > 1) {
                  recording.fps = (parseInt(fps[0], 10) / parseInt(fps[1], 10)).toFixed(0);
                }
              }

              // Get duration (in seconds)
              if (l.includes("duration=")) {
                recording.duration = parseFloat(l.replace("duration=", ""));
              }
            });

          // Append recording to PastRecordings file
          // JSON string is appended with a ',' at the end. If you are going to use
          // the data in this file, always remove the last letter (the ',') first.
          // This is done so that we don't have to read the whole file first to append it properly.
          fs.appendFile(
            PathHelper.getFile("PastRecordings.json"),
            `${JSON.stringify(recording, null, 2)},`,
            (err: any) => {
              if (err) throw err;
            }
          );
        }
      }
    );
  }

  /**
   * Create thumbnail for video
   * @param videoPath Path to video to create thumbnail for
   */
  public static createThumbnail(videoPath: string): string {
    const ffmpeg = new FFmpeg();
    const thumbPath = path.join(
      PathHelper.ensureExists(RecordingSettings.thumbSaveFolder, true),
      path.basename(videoPath) + ".png"
    );

    ffmpeg.run(`-i "${videoPath}" -frames:v 1 "${thumbPath}"`);

    return thumbPath;
  }

  public static async clip(videoPath: string, timestamps: number[]) {
    const ffmpeg = new FFmpeg();
    const outFolder = PathHelper.ensureExists(
      `${RecordingSettings.videoSaveFolder}/clips/.processing/${PathHelper.fileNameNoExt(videoPath)}`,
      true
    );
    const manifestStream = fs.createWriteStream(outFolder + "/manifest.txt", { flags: "a" });

    // Create clips from video.
    // Clips are stored in a temporary folder for now until they are merged into one video.
    for (let i = 0, ii = 0, n = timestamps.length; ii < n; ++i, ii += 2) {
      const curFile = outFolder + `/${i}.mp4`;

      manifestStream.write(`file '${curFile}'\n`);

      await ffmpeg.run(`-ss ${timestamps[ii]} -to ${timestamps[ii + 1]} -i "${videoPath}" -c copy "${curFile}"`, {
        stdoutCallback: (m: any) => {
          // console.log(m);
        },
        stderrCallback: (m: any) => {
          // console.log(m);
        },
        onExitCallback: (m: any) => {
          console.log("EXITED " + m);
        }
      });
    }

    manifestStream.end();

    ffmpeg.run(
      `-f concat -safe 0 -i "${outFolder}/manifest.txt" -c copy ${RecordingSettings.videoSaveFolder}/clips/clip.mp4`,
      {
        stdoutCallback: (m: any) => {
          console.log(m);
        },
        stderrCallback: (m: any) => {
          console.log(m);
        },
        onExitCallback: (m: any) => {
          console.log(m);
        }
      }
    );
  }
}
