using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Casterr.SettingsLib;
using Casterr.RecorderLib.FFmpeg;

namespace Casterr.RecorderLib
{
  public static class Recordings
  {
    public static List<Recording> Get()
    {
      List<Recording> recordings = new List<Recording>();
      SettingsManager sm = new SettingsManager();

      // Deserialize past recordings into array
      var videos = JsonConvert.DeserializeObject<JArray>(
        $"[{File.ReadAllText(sm.GetFilePath("PastRecordings.json"))}]"
      );

      foreach (var v in videos)
      {
        var videoPath = (string) v["VideoPath"];
        var thumbPath = (string) v["ThumbPath"];
        var fileSize = (long) v["FileSize"];
        var fps = (string) v["FPS"];
        var duration = (string) v["Duration"];

        // Skip this iteration if video path doesn't exist
        if (!File.Exists(videoPath))
        {
          continue;
        }

        // Add recording to list
        recordings.Add(new Recording {
          VideoPath = videoPath,
          ThumbPath = (File.Exists(thumbPath)) ? thumbPath : null,
          FileSize = fileSize,
          FPS = fps,
          Duration = duration
        });
      }

      // Reverse recordings list to show latest recordings first.
      // Since the latest recordings are at the bottom of the json,
      // they end up at the bottom of the list
      recordings.Reverse();

      return recordings;
    }

    public static async Task Add(string videoPath)
    {
      var ff = new ProcessManager();
      var rc = new Recording();
      var sm = new SettingsManager();
      var rs = new RecordingSettings();
      using var sw = new StreamWriter(sm.GetFilePath("PastRecordings.json"), true);

      sm.GetSettings(rs);

      // Video Path
      rc.VideoPath = videoPath;

      // Thumbnail Path
      rc.ThumbPath = await VideoThumbnailer.Create(videoPath);

      // File Size
      rc.FileSize = new FileInfo(videoPath).Length;

      #region Get Infro from ffprobe (fps, duration)
      // Query ffprobe to get video duration and fps
      // https://trac.ffmpeg.org/wiki/FFprobeTips
      var info = await ff.StartProcess(
        $"-v error -select_streams v:0 -show_entries format=duration:stream=avg_frame_rate -of default=noprint_wrappers=1 \"{videoPath}\"",
        "ffprobe",
        true,
        true
      );

      // Loop over each line in response from ffprobe
      foreach (var line in info.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries))
      {
        // Get framerate
        if (line.ToLower().Contains("avg_frame_rate"))
        {
          var fps = line.ToLower().Replace("avg_frame_rate=", "").Split("/");

          // Check that fps contains more than 1 item, 2 are needed
          if (fps.Count() > 1)
          {
            // Make sure fps[0 & 1] are able to be parsed
            if (int.TryParse(fps[0], out int res0) && int.TryParse(fps[1], out int res1))
            {
              rc.FPS = (res0 / res1).ToString();
            }
          }
        }

        // Get duration
        if (line.ToLower().Contains("duration"))
        {
          // Try parsing duration of video into float, if can't don't set any duration
          if (float.TryParse(line.ToLower().Replace("duration=", ""), out var res))
          {
            // Convert duration in seconds to TimeSpan
            var t = TimeSpan.FromSeconds(res);

            #region Set Readable Duration
            // If t.Days > 0, then set Duration to it and append Day(s) ...
            // ... and skip rest of foreach iteration

            if (t.Days > 0)
            {
              rc.Duration = (t.Days > 1) ? $"{t.Days} Days" : $"{t.Days} Day";
              continue;
            }

            if (t.Hours > 0)
            {
              rc.Duration = (t.Hours > 1) ? $"{t.Hours} Hours" : $"{t.Hours} Hour";
              continue;
            }

            if (t.Minutes > 0)
            {
              rc.Duration = (t.Minutes > 1) ? $"{t.Minutes} Minutes" : $"{t.Minutes} Minute";
              continue;
            }

            if (t.Seconds > 0)
            {
              rc.Duration = (t.Seconds > 1) ? $"{t.Seconds} Seconds" : $"{t.Seconds} Second";
              continue;
            }

            if (t.Milliseconds > 0)
            {
              rc.Duration = (t.Milliseconds > 1) ? $"{t.Milliseconds} Milliseconds" : $"{t.Milliseconds} Milliseconds";
              continue;
            }
            #endregion
          }
        }
      }
      #endregion

      // Serialize json from Recording object
      var json = (JObject) JToken.FromObject(rc);

      // If file is empty then append json normally, if it isn't then append json starting with a ','
      sw.Write((new FileInfo(sm.GetFilePath("PastRecordings.json")).Length == 0) ? json.ToString() : $",{json}");
      sw.Close();
    }
  }
}
