using System.IO;
using System.Threading.Tasks;
using Casterr.SettingsLib;

namespace Casterr.RecorderLib.FFmpeg
{
  public static class VideoThumbnailer
  {
    public static async Task<string> Create(string videoPath)
    {
      var process = new ProcessManager();
      var sm = new SettingsManager();
      var rs = new RecordingSettings();
      var thumbPath = Path.Combine(PathHelper.FolderPath(rs.ThumbSaveFolder), (Path.GetFileName(videoPath) + ".png"));

      // Get settings
      sm.GetSettings(rs);

      // Get video thumbnail - closes automatically
      await process.StartProcess($"-i \"{videoPath}\" -frames:v 1 \"{thumbPath}\"");

      return thumbPath;
    }
  }
}
