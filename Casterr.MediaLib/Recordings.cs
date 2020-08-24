using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Casterr.SettingsLib;

namespace Casterr.MediaLib
{
  public static class Recordings
  {
    public static List<Recording> Get()
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

        recordings.Add(new Recording {
          VideoPath = v,
          ThumbPath = (File.Exists(thumbPath)) ? thumbPath : null,
          FileSize = fi.Length
        });
      }

      return recordings;
    }
  }
}
