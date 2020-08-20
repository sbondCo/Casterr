using System.Runtime.InteropServices;
using System.IO;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace Casterr.RecorderLib.FFmpeg
{
  public static class FindFFmpeg
  {
    /// <summary>
    /// FFmpeg executable name
    /// </summary>
    /// <value>FFmpeg executable name</value>
    static string FFmpegExeName
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

    /// <summary>
    /// Get path to FFmpeg exe.
    /// </summary>
    /// <returns>Path to FFmpeg exe.</returns>
    public static async Task<string> GetPath()
    {
      Console.WriteLine("#1");
      string execPath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
      Console.WriteLine("#2");

      string ffmpegPath = Path.Combine(execPath, FFmpegExeName);
      Console.WriteLine(ffmpegPath);

      // If FFmpegPath does not exist, go download it
      if (!File.Exists(ffmpegPath))
      {
        Console.WriteLine("#3");

        // DownloadFFmpeg df = new DownloadFFmpeg();
        await DownloadFFmpeg.Download(ffmpegPath, FFmpegExeName);
        Console.WriteLine("#4");
      }

      return ffmpegPath;
    }
  }
}
