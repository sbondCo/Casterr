using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Casterr.SettingsLib;
using Casterr.RecorderLib.FFmpeg;
using Casterr.HelpersLib;
using Newtonsoft.Json.Linq;

namespace Casterr.MediaLib
{
  public static class Recordings
  {
    public static async Task<List<Recording>> Get()
    {
      List<Recording> recordings = new List<Recording>();
      SettingsManager sm = new SettingsManager();
      RecordingSettings rs = new RecordingSettings();

      sm.GetSettings(rs);

      // Deserialize past recordings into array
      var videos = JsonConvert.DeserializeObject<JArray>(
        $"[{File.ReadAllText(sm.GetFilePath("PastRecordings.json"))}]"
      );

      foreach (var v in videos)
      {
        var videoPath = (string) v["VideoPath"];
        var thumbPath = Path.Combine(rs.ThumbSaveFolder, $"{Path.GetFileName(videoPath)}.png");
        var fileSize = (long) v["FileSize"];
        var fps = (string) v["FPS"];
        var duration = (string) v["Duration"];

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

    private static async Task<Dictionary<string, string>> GetVideoInfo(string video)
    {
      var ff = new ProcessManager();
      var d = new Dictionary<string, string>();

      // Query ffprobe to get video duration and fps
      var info = await ff.StartProcess(
        $"-v error -select_streams v:0 -show_entries format=duration -sexagesimal -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1 \"{video}\"",
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
          d.Add("fps", line.ToLower().Replace("avg_frame_rate=", ""));
        }

        // Get duration
        if (line.ToLower().Contains("duration"))
        {
          d.Add("duration", line.ToLower().Replace("duration=", ""));
        }
      }

      return d;
    }
  }
}
