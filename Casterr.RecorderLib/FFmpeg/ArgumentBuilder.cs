using System;
using System.Text;
using Casterr.SettingsLib;
using Casterr.RecorderLib.FFmpeg;
using Casterr.HelpersLib;

namespace Casterr.RecorderLib.FFmpeg
{
    public class ArgumentBuilder
    {
        /// <summary>
        /// Build arguments from RecordingSettings for ffmpeg
        /// </summary>
        public string BuildArgs()
        {
            SettingsManager sm = new SettingsManager();
            RecordingSettings rs = new RecordingSettings();
            DeviceManager dm = new DeviceManager();
            StringBuilder sb = new StringBuilder();

            // Get settings
            sm.GetSettings(rs);

            // Add directshow
            sb.Append($"-f dshow ");

            // Add video device
            if (rs.VideoDevice.ToLower().EqualsAnyOf("default", "desktop screen"))
            {
                sb.Append($"-i video=\"{dm.DesktopVideoDevice}\" ");
            }
            else
            {
                sb.Append($"-i video=\"{rs.VideoDevice}\" ");
            }

            //Add FPS, if is an integer, otherwise default to 30
            if (rs.FPS.IsInt())
            {
                sb.Append($"-framerate {rs.FPS} ");
            }
            else
            {
                sb.Append($"-framerate 30 ");
            }

            //Add resolution/ video - size, default to 1920x1080
            sb.Append("-video_size ");

            switch (rs.Resolution)
            {
                case "1080p":
                    sb.Append($"1920x1080 ");
                    break;
                case "720p":
                    sb.Append($"1280x720 ");
                    break;
                default:
                    sb.Append($"1920x1080 ");
                    break;
            }

            // Set format
            sb.Append($"{Environment.GetFolderPath(Environment.SpecialFolder.MyVideos)}\\");

            switch (rs.Format)
            {
                case "mp4":
                    sb.Append($"out.mp4");
                    break;
                case "mkv":
                    sb.Append($"out.mkv");
                    break;
            }

            Console.WriteLine($"args: {sb}");

            return sb.ToString();
        }
    }
}
