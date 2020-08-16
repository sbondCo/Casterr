using System.Collections.Generic;
using System.IO;
using Casterr.SettingsLib;

namespace Casterr.RecorderLib
{
  public class RecordingPath
  {
    public string VideoPath { get; set; }
    public string ThumbPath { get; set; }
  }

  public static class RecordingPaths
  {
    public static List<RecordingPath> Get()
    {
      SettingsManager sm = new SettingsManager();
      RecordingSettings rs = new RecordingSettings();
      List<RecordingPath> ri = new List<RecordingPath>();

      // Get settings
      sm.GetSettings(rs);

      foreach (string f in Directory.GetFiles(rs.VideoSaveFolder, "*.mp4", SearchOption.AllDirectories))
      {
        // Path that should be to the thumbnail, unless it has been moved/name changed
        string tPath = $"{rs.ThumbSaveFolder}\\{Path.GetFileName(f)}.png";

        // If thumbnail does not exist, make it an empty string for List
        if (!File.Exists(tPath))
        {
          tPath = "";
        }

        // Add paths to list
        ri.Add(new RecordingPath { VideoPath = f, ThumbPath = tPath });
      }

      return ri;
    }
  }
}
