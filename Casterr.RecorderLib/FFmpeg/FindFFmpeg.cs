using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Casterr.RecorderLib.FFmpeg
{
    class FindFFmpeg
    {
        const string FFmpegExeName = "ffmpeg.exe";

        public async Task<string> GetPath()
        {
            string execPath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
            string ffmpegPath = $"{execPath}\\{FFmpegExeName}";

            // If FFmpegPath does not exist, go download it
            if (!File.Exists(ffmpegPath))
            {
                DownloadFFmpeg df = new DownloadFFmpeg();
                await df.Download(ffmpegPath, FFmpegExeName);
            }

            return ffmpegPath;
        }
    }
}
