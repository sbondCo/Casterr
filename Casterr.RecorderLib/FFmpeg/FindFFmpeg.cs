using System.Runtime.InteropServices;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace Casterr.RecorderLib.FFmpeg
{
  public static class FindFFmpeg
  {
    /// <value>FFmpeg executable name</value>
    public static string FFmpegExeName
    { 
      get
      {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
          // Windows needs .exe extension
          return "ffmpeg.exe";
        }
        else
        {
          // Linux & Mac need no extension
          return "ffmpeg";
        }
      }
    }

    /// <value>FFprobe executable name</value>
    public static string FFprobeExeName
    { 
      get
      {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
          // Windows needs .exe extension
          return "ffprobe.exe";
        }
        else
        {
          // Linux & Mac need no extension
          return "ffprobe";
        }
      }
    }

    /// <summary>
    /// Get path to FFmpeg exe.
    /// </summary>
    /// <returns>Path to FFmpeg exe.</returns>
    public static async Task<string> GetPath(string which = "ffmpeg")
    {
      string execPath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);

      string ffmpegPath = Path.Combine(execPath, FFmpegExeName);
      string ffprobePath = Path.Combine(execPath, FFprobeExeName);

      // If ffmpeg or ffprobe does not exist, go download it
      if (!File.Exists(ffmpegPath) || !File.Exists(ffprobePath))
      {
        await DownloadFFmpeg.Download();
      }

      // Return path to executable
      if (which.ToLower() == "ffprobe")
      {
        return ffprobePath;
      }
      
      // Always return ffmpegPath, unless something gets returned in if statement above
      return ffmpegPath;
    }
  }
}
