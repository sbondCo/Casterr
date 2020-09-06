using System.Runtime.InteropServices;
using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;
using Casterr.HelpersLib;

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
    public static async Task Download()
    {
      ProgramStatus.DoingSomething(true, "Downloading FFmpeg", 0);

      await DownloadZip();
      await ExtractZip();

      ProgramStatus.DoingSomething(false);
    }

    /// <summary>
    /// Download correct version of FFmpeg depending on your OS
    /// </summary>
    public static async Task DownloadZip()
    {
      var bits = Environment.Is64BitOperatingSystem ? 64 : 32;

      if (bits == 32) throw new Exception("No FFmpeg download link for 32 bit systems.");

      // Set DownloadUri depending on OS
      if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
      {
        DownloadUri = new Uri($"https://ul.sbond.co/ffmpeg/ffmpeg-latest-win-amd64.zip");
      }
      else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
      {
        DownloadUri = new Uri($"https://ul.sbond.co/ffmpeg/ffmpeg-latest-macos-amd64.zip");
      }
      else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
      {
        DownloadUri = new Uri($"https://ul.sbond.co/ffmpeg/ffmpeg-release-linux-amd64.zip");
      }

      ZipPath = Path.Combine(Path.GetTempPath(), "ffmpeg.zip");

      // Update programStatus on ProgressChanged
      DownloadHelper.ProgressChanged += (progress => { ProgramStatus.DoingSomething(true, "Downloading FFmpeg", progress); });
      await DownloadHelper.Download(DownloadUri, ZipPath);
    }

    /// <summary>
    /// Extract FFmpeg binary from downloaded zip
    /// </summary>
    /// <param name="finalPath">Place to extract FFmpeg binary</param>
    public static async Task ExtractZip()
    {
      ProgramStatus.DoingSomething(true, "Extracting FFmpeg", 0);

      ZipArchive zip;

      await Task.Run(() =>
      {
        // Read all zip contents and find ffmpeg.exe
        zip = ZipFile.OpenRead(ZipPath);

        // Get ffmpeg and ffprobe from zip
        var ffFiles = zip.Entries.Where(f => f.Name == FindFFmpeg.FFmpegExeName || f.Name == FindFFmpeg.FFprobeExeName);
        var iteration = 1;

        // Extract ffFiles to folder current app is being run from
        foreach (var f in ffFiles)
        {
          var dest = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), f.Name);

          // Don't extract if file already exists
          // This avoids a 'file already exists' error when extracting ...
          // ... without overwrite if file already exists and it has exec rights
          if (!File.Exists(dest))
          {
            f.ExtractToFile(Path.Combine(dest));
          }

          // Set progess percentage to amount of files extracted
          ProgramStatus.DoingSomething(true, "Extracting FFmpeg", (int) (Decimal.Divide(iteration, ffFiles.Count()) * 100));
          iteration++;
        }

        // Dispose and delete zip file
        zip.Dispose();
        File.Delete(ZipPath);
      });

      ProgramStatus.DoingSomething(true, "Extracting FFmpeg", 100);
    }
  }
}
