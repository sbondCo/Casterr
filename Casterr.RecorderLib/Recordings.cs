using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using Casterr.SettingsLib;
using Casterr.RecorderLib.FFmpeg;
using Newtonsoft.Json.Linq;
using System;

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
      rc.ThumbPath = Path.Combine(rs.ThumbSaveFolder, $"{Path.GetFileName(videoPath)}.png");

      // File Size
      rc.FileSize = new FileInfo(videoPath).Length;

      #region Get Infro from ffprobe (fps, duration)
      // Query ffprobe to get video duration and fps
      var info = await ff.StartProcess(
        $"-v error -select_streams v:0 -show_entries format=duration -sexagesimal -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1 \"{videoPath}\"",
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
          rc.FPS = line.ToLower().Replace("avg_frame_rate=", "");
        }

        // Get duration
        if (line.ToLower().Contains("duration"))
        {
          rc.Duration = line.ToLower().Replace("duration=", "");
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
