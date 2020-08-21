using System.Runtime.InteropServices;
using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Casterr.RecorderLib.FFmpeg
{
  static class DownloadFFmpeg
  {
    static Uri DownloadUri;
    static string ZipPath;

    /// <summary>
    /// Download and extract FFmpeg
    /// </summary>
    /// <param name="finalPath">Final path for FFmpeg</param>
    /// <param name="exeName">FFmpeg binary name</param>
    /// <returns></returns>
    public static async Task Download(string finalPath, string exeName)
    {
      await DownloadZip();
      await ExtractZip(finalPath, exeName);
    }

    /// <summary>
    /// Download correct version of FFmpeg depending on your OS
    /// </summary>
    public static async Task DownloadZip()
    {
      var bits = Environment.Is64BitOperatingSystem ? 64 : 32;

      // Set DownloadUri depending on OS
      if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
      {
        DownloadUri = new Uri($"https://ffmpeg.zeranoe.com/builds/win{bits}/static/ffmpeg-latest-win{bits}-static.zip");
      }
      else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
      {
        // I believe MacOS is only compatible with 64 bit applications
        DownloadUri = new Uri($"https://ffmpeg.zeranoe.com/builds/macos64/static/ffmpeg-latest-macos64-static.zip");
      }
      else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
      {
        if (bits == 64)
        {
          DownloadUri = new Uri($"https://ul.sbond.co/ffmpeg/ffmpeg-release-linux-amd64.zip");
        }
        else
        {
          throw new Exception("No FFmpeg download link for 32 bit systems on Linux.");
        }
      }

      ZipPath = Path.Combine(Path.GetTempPath(), "ffmpeg.zip");

      var wc = new WebClient();
      await wc.DownloadFileTaskAsync(DownloadUri, ZipPath);
    }

    /// <summary>
    /// Extract FFmpeg binary from downloaded zip
    /// </summary>
    /// <param name="finalPath">Place to extract FFmpeg binary</param>
    /// <param name="exeName">Name of FFmpeg binary</param>
    public static async Task ExtractZip(string finalPath, string exeName)
    {
      ZipArchive zip;

      await Task.Run(() =>
      {
        // Read all zip contents and find ffmpeg.exe
        zip = ZipFile.OpenRead(ZipPath);
        var ffmpegExeFile = zip.Entries.First(M => M.Name == exeName);

        // Extract ffmpeg.exe to finalpath
        ffmpegExeFile.ExtractToFile(finalPath, true);

        // Dispose and delete zip file
        zip.Dispose();
        File.Delete(ZipPath);
      });
    }
  }
}
