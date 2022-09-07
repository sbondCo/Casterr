import FFmpeg from "./ffmpeg";
import PathHelper from "./../helpers/pathHelper";
import fs from "fs";
import path from "path";
import ArgumentBuilder from "./argumentBuilder";
import Notifications from "./../helpers/notifications";
import { store } from "@/app/store";

export interface Recording {
  name: string;
  videoPath: string;
  thumbPath: string | undefined;
  fileSize: number | undefined;
  fps: string | undefined;
  duration: number | undefined;
}

export default class RecordingsManager {
  /**
   * Get all user's past recordings in order ready for viewing.
   * @param clips If should fetch clips, instead of recordings.
   * @returns All recordings | clips.
   */
  public static async get(clips: boolean = false): Promise<Array<Recording>> {
    return (await this.getVideos(clips)).reverse();
  }

  /**
   * Add video to user's recordings file.
   * @param videoPath Path to video that should be added.
   * @param isClip If adding a clip instead of a recording.
   */
  public static async add(videoPath: string, isClip: boolean = false): Promise<void> {
    // Throw exception if video from videoPath does not exist
    if (!fs.existsSync(videoPath)) throw new Error("Can't add recording that doesn't exist!");

    const ffprobe = new FFmpeg("ffprobe");
    const recording = {} as Recording;

    recording.name = path.basename(videoPath);
    recording.videoPath = videoPath;
    recording.thumbPath = await this.createThumbnail(videoPath);
    recording.fileSize = fs.statSync(videoPath).size;

    // Get video info from ffprobe
    ffprobe.run(
      `-v error -select_streams v:0 -show_entries format=duration:stream=avg_frame_rate -of default=noprint_wrappers=1 "${videoPath}"`,
      "onExit",
      {
        stdoutCallback: async (out: string) => {
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

          // Append recording to recordings file
          // JSON string is appended with a ',' at the end. If you are going to use
          // the data in this file, always remove the last letter (the ',') first.
          // This is done so that we don't have to read the whole file first to append it properly.
          fs.appendFile(await this.getVideoFile(isClip), this.toWritingReady(recording), (err: any) => {
            if (err) throw err;
          });
        }
      }
    );
  }

  /**
   * Delete a video.
   * @param videoPath Path to video to be deleted.
   * @param isClip If video is a clip.
   * @param removeFromDisk If should also remove from disk.
   */
  public static async delete(videoPath: string, isClip: boolean, removeFromDisk: boolean = false) {
    let videos = await this.getVideos(isClip);
    const vidIdx = videos.findIndex((e) => e.videoPath == videoPath);
    const video = videos[vidIdx];

    if (video?.videoPath) {
      // Delete video file from disk
      if (removeFromDisk) {
        if (video.videoPath) fs.rmSync(video.videoPath, { force: true });
        if (video.thumbPath) fs.rmSync(video.thumbPath, { force: true });
      }

      // Remove video from videos array
      videos = videos.filter((e) => e.videoPath !== video.videoPath);

      // Rewrite video file
      fs.writeFile(await this.getVideoFile(isClip), this.toWritingReady(videos, false), (err) => {
        if (err) throw err;
      });
    }
  }

  /**
   * Create thumbnail for video
   * @param videoPath Path to video to create thumbnail for
   */
  public static async createThumbnail(videoPath: string) {
    const rs = store.getState().settings.recording;
    const ffmpeg = new FFmpeg();
    const thumbPath = path.join(
      await PathHelper.ensureExists(rs.thumbSaveFolder, true),
      path.basename(videoPath) + ".png"
    );

    ffmpeg.run(`-i "${videoPath}" -frames:v 1 "${thumbPath}"`);

    return thumbPath;
  }

  /**
   * Clip a recording.
   * @param videoPath Path to video being clipped.
   * @param timestamps Timestamps from recording to clip.
   */
  public static async clip(videoPath: string, timestamps: number[]) {
    const videoSaveFolder = store.getState().settings.recording.videoSaveFolder;
    // Make sure .processing folder exists and is hidden
    PathHelper.ensureExists(`${videoSaveFolder}/clips/.processing`, true, {
      hidden: true
    });

    const ffmpeg = new FFmpeg();
    const clipOutName = `${PathHelper.fileNameNoExt(ArgumentBuilder.videoOutputName)}`;
    const clipOutExt = path.extname(videoPath); // Make clip ext same as videos
    const clipOutPath = `${videoSaveFolder}/clips/${clipOutName}${clipOutExt}`;
    const tmpOutFolder = await PathHelper.ensureExists(`${videoSaveFolder}/clips/.processing/${clipOutName}`, true);
    const manifestStream = fs.createWriteStream(tmpOutFolder + "/manifest.txt", { flags: "a" });
    const popupName = "clipVideo";

    Notifications.popup(popupName, "Clipping Your Video", { loader: true, showCancel: true }).then((popup) => {
      if (popup.action == "cancel") {
        Notifications.popup(popupName, "Cancelling Processing Of Your Video");

        // Stop ffmpeg and destroy manifestStream
        ffmpeg.kill();
        manifestStream.destroy();

        // Remove associated files/folders if they exist
        PathHelper.removeDir(tmpOutFolder);
        PathHelper.removeFile(clipOutPath);

        // When FFmpeg is closed, popup is also deleted below, but FFmpeg won't always
        // be open when user is cancelling so also delete it here just incase.
        Notifications.deletePopup(popupName);
      }
    });

    // Create clips from video.
    // Clips are stored in a temporary folder for now until they are merged into one video.
    for (let i = 0, ii = 0, n = timestamps.length; ii < n; ++i, ii += 2) {
      const curFile = tmpOutFolder + `/${i}.mp4`;

      manifestStream.write(`file '${curFile}'\n`);

      await ffmpeg.run(
        `-ss ${timestamps[ii]} -i "${videoPath}" -to ${
          timestamps[ii + 1] - timestamps[ii]
        } -map 0 -avoid_negative_ts 1 "${curFile}"`
      );
    }

    manifestStream.end();

    // Concatenate all seperate clips into one video
    ffmpeg.run(
      `-f concat -safe 0 -i "${tmpOutFolder}/manifest.txt" -map 0 -avoid_negative_ts 1 -c copy "${clipOutPath}"`,
      "onExit",
      {
        // After creating final clip...
        onExitCallback: () => {
          // Remove temp dir and files inside it
          PathHelper.removeDir(tmpOutFolder);
          Notifications.deletePopup(popupName);

          // Add clip to clips file
          this.add(clipOutPath, true);
        }
      }
    );
  }

  /**
   * Rename a video and update it in the correct video file.
   * @param videoPath Path to video. Used to search for correct video.
   * @param to What to rename video to.
   * @param isClip If video is a clip.
   */
  public static async rename(videoPath: string, to: string, isClip: boolean) {
    const videos = await this.getVideos(isClip);
    const video = videos.find((v) => v.videoPath == videoPath);

    if (!video) throw new Error("Couldn't find video to rename.");

    video.name = to;

    fs.writeFile(await this.getVideoFile(isClip), this.toWritingReady(videos, false), (err) => {
      if (err) throw err;
    });
  }

  /**
   * Get JSON object ready for writing to a video file.
   * @param obj Video(s) object to write to file.
   * @param forAppending If get ready for appending and not replacing the file.
   * @returns Same object, but ready for writing to video file.
   */
  private static toWritingReady(obj: Object, forAppending: boolean = true) {
    let w = JSON.stringify(obj);

    if (!forAppending) {
      w = `${w.slice(0, -1).slice(1).trim()}`;
    }

    return `${w},`;
  }

  /**
   * Get correct video file name.
   * @param clips If should get clips file.
   * @returns Name of file including videos.
   */
  private static getVideoFile(clips: boolean) {
    return PathHelper.getFile(clips ? "clips" : "recordings");
  }

  /**
   * Read and return videos from file.
   * @param clips If should return clips instead of recordings.
   * @returns All videos from specified file.
   */
  private static async getVideos(clips: boolean) {
    const videos = new Array<Recording>();

    // Get all videos from appropriate json file
    const data = fs.readFileSync(await this.getVideoFile(clips), "utf8");

    // Parse JSON from file and assign it to recordings variable.
    // Because it is stored in a way so that we don't have to read the file
    // before writing to it, we need to prepare the data in the file before it is parsable JSON.
    // 1. Make into array by wrapping [square brackets] around it.
    // 2. If last letter in data is a ',' then remove it.
    Object.assign(videos, JSON.parse(`[${data.slice(-1) == "," ? data.slice(0, -1) : data}]`));

    return videos;
  }
}
