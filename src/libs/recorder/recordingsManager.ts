import FFmpeg from "./ffmpeg";
import PathHelper from "./../helpers/pathHelper";
import fs from "fs";
import path from "path";
import ArgumentBuilder from "./argumentBuilder";
import Notifications from "./../helpers/notifications";
import { store } from "@/app/store";
import { Video } from "@/videos/types";
import { videoAdded, videoRemoved } from "@/videos/videosSlice";

export default class RecordingsManager {
  /**
   * Add video to user's recordings file.
   * @param videoPath Path to video that should be added.
   * @param isClip If adding a clip instead of a recording.
   */
  public static async add(videoPath: string, isClip: boolean = false): Promise<void> {
    // Throw exception if video from videoPath does not exist
    if (!fs.existsSync(videoPath)) throw new Error("Can't add recording that doesn't exist!");

    const ffprobe = new FFmpeg("ffprobe");
    const recording = {} as Video;

    recording.name = path.basename(videoPath);
    recording.videoPath = videoPath;
    recording.thumbPath = await this.createThumbnail(videoPath);
    recording.fileSize = fs.statSync(videoPath).size;
    recording.time = Date.now();
    recording.isClip = isClip;

    // Get video info from ffprobe
    ffprobe
      .run(
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

            store.dispatch(videoAdded(recording));
          }
        }
      )
      .catch((e) => {
        throw new Error("Failed to probe recording for information.", e);
      });
  }

  /**
   * Delete a video.
   * @param video Video to be deleted.
   * @param rmFromDisk Remove video from disk.
   */
  public static async delete(video: Video, rmFromDisk: boolean) {
    store.dispatch(videoRemoved(video));

    if (rmFromDisk) {
      if (video.videoPath) fs.rmSync(video.videoPath, { force: true });
      if (video.thumbPath) fs.rmSync(video.thumbPath, { force: true });
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

    await ffmpeg.run(`-i "${videoPath}" -frames:v 1 "${thumbPath}"`);

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
    await PathHelper.ensureExists(`${videoSaveFolder}/clips/.processing`, true, {
      hidden: true
    });

    const ffmpeg = new FFmpeg();
    const clipOutName = `${PathHelper.fileNameNoExt(ArgumentBuilder.videoOutputName)}`;
    const clipOutExt = path.extname(videoPath); // Make clip ext same as videos
    const clipOutPath = `${videoSaveFolder}/clips/${clipOutName}${clipOutExt}`;
    const tmpOutFolder = await PathHelper.ensureExists(`${videoSaveFolder}/clips/.processing/${clipOutName}`, true);
    const manifestStream = fs.createWriteStream(tmpOutFolder + "/manifest.txt", { flags: "a" });
    const popupName = "clipVideo";

    Notifications.popup({ id: popupName, title: "Clipping Your Video", loader: true, showCancel: true })
      .then(async (popup) => {
        if (popup.action === "cancel") {
          Notifications.popup({ id: popupName, title: "Cancelling Processing Of Your Video" }).catch((e) => {
            console.error("Failed to update cancel clipping process notification", e);
          });

          // Stop ffmpeg and destroy manifestStream
          await ffmpeg.kill();
          manifestStream.destroy();

          // Remove associated files/folders if they exist
          await PathHelper.removeDir(tmpOutFolder);
          await PathHelper.removeFile(clipOutPath);

          // When FFmpeg is closed, popup is also deleted below, but FFmpeg won't always
          // be open when user is cancelling so also delete it here just incase.
          Notifications.rmPopup(popupName);
        }
      })
      .catch((e) => {
        console.error("Failed to show cancel clipping process notification", e);
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
    await ffmpeg.run(
      `-f concat -safe 0 -i "${tmpOutFolder}/manifest.txt" -map 0 -avoid_negative_ts 1 -c copy "${clipOutPath}"`,
      "onExit",
      {
        // After creating final clip...
        onExitCallback: async () => {
          // Remove temp dir and files inside it
          await PathHelper.removeDir(tmpOutFolder);
          Notifications.rmPopup(popupName);

          // Add clip to clips file
          await this.add(clipOutPath, true);
        }
      }
    );
  }

  /**
   * Get JSON object ready for writing to a video file.
   * @param obj Video(s) object to write to file.
   * @param forAppending If get ready for appending and not replacing the file.
   * @returns Same object, but ready for writing to video file.
   */
  public static toWritingReady(obj: Video | Video[], forAppending: boolean = true) {
    if (!obj) return "";

    if (obj instanceof Array) {
      if (obj.length <= 0) {
        return "";
      }
    }

    let w = JSON.stringify(obj);

    if (!forAppending) {
      w = `${w.slice(0, -1).slice(1).trim()}`;
    }

    return `${w},`;
  }
}
