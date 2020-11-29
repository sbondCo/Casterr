import FFmpeg from "./ffmpeg";

export default class RecordingsManager {
  private static ffprobe = new FFmpeg("ffprobe");

  public static add(videoPath: string) {
    var info = this.ffprobe.run(
      `-v error -select_streams v:0 -show_entries format=duration:stream=avg_frame_rate -of default=noprint_wrappers=1 "${videoPath}"`,
      {
        stdoutCallback: (out: string) => {
          // Loop over each line in response from ffprobe, removing empty lines
          out.toLowerCase().split(/\r\n|\r|\n/g).filter(l => l !== "").forEach((l: string) => {
            // Get framerate
            if (l.includes("avg_frame_rate=")) {
              // Framerate is returned like: '60/1', '30/1', '30000/1001', etc
              // We need to do the math to get the framerate to avoid 
              // returning something like 30000, so split the response by the slash
              let fps = l.replace("avg_frame_rate=", "").split("/");

              // If fps array has more than 1 items, then divide
              // the first by the second and round to nearest whole number.
              if (fps.length > 1) {
                console.log((parseInt(fps[0]) / parseInt(fps[1])).toFixed(0));
              }
            }

            // Get duration
            if (l.includes("duration=")) {
              let duration = l.replace("duration=", "");

              console.log(duration);
            }
          });
        }
      }
    );
  }
}
