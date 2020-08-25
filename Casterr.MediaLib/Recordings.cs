using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Casterr.SettingsLib;
using Casterr.RecorderLib.FFmpeg;

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

      var videos = Directory
        .EnumerateFiles(rs.VideoSaveFolder)
        .Where(v => v.ToLower().EndsWith("mp4") || v.ToLower().EndsWith("mkv"))
        .ToList();

      foreach (var v in videos)
      {
        var fi = new FileInfo(v);
        var thumbPath = Path.Combine(rs.ThumbSaveFolder, $"{Path.GetFileName(v)}.png");
        var videoInfo = await GetVideoInfo(v);

        recordings.Add(new Recording {
          VideoPath = v,
          ThumbPath = (File.Exists(thumbPath)) ? thumbPath : null,
          FileSize = fi.Length,
          FPS = (videoInfo.TryGetValue("fps", out var fps)) ? fps : "N/A",
          Duration = (videoInfo.TryGetValue("duration", out var duration)) ? duration : "N/A"
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
