using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Casterr.RecorderLib.FFmpeg
{
    class DownloadFFmpeg
    {
        Uri DownloadUri;
        string ZipPath;

        public async Task Download(string finalPath, string exeName)
        {
            await DownloadZip();
            await ExtractZip(finalPath, exeName);
        }

        public async Task DownloadZip()
        {
            var bits = Environment.Is64BitOperatingSystem ? 64 : 32;

            DownloadUri = new Uri($"https://ffmpeg.zeranoe.com/builds/win{bits}/static/ffmpeg-latest-win{bits}-static.zip");

            ZipPath = Path.Combine(Path.GetTempPath(), "ffmpeg.zip");

            var wc = new WebClient();
            await wc.DownloadFileTaskAsync(DownloadUri, ZipPath);
        }

        public async Task ExtractZip(string finalPath, string exeName)
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
