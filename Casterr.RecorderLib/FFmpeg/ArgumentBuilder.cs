using System.Text;
using Casterr.SettingsLib;
using Casterr.HelpersLib;
using System;

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

            #region Add DirectShow and Configure Audio
            // Add directshow
            sb.Append($"-f dshow ");

            // Add video device
            if (rs.VideoDevice.ToLower().EqualsAnyOf("default", "desktop screen", dm.DesktopVideoDevice))
            {
                string audio = string.Empty;

                // Audio Device (users mic, unless they have a different weird input)
                if (rs.AudioDevice.ToLower() != "none")
                {
                    var allDevices = dm.GetDevices();

                    if (rs.AudioDevice.ToLower().EqualsAnyOf("default"))
                    {
                        // If set to default, just get first audio device ffmpeg returned
                        audio = $":audio=\"{allDevices.Result.Item1[0]}\"";
                    }
                    else
                    {
                        // else, get audio device from settings
                        audio = $":audio=\"{rs.AudioDevice}\"";
                    }
                }

                sb.Append($"-i video=\"{dm.DesktopVideoDevice}\"{audio} ");
            }
            else
            {
                sb.Append($"-i video=\"{rs.VideoDevice}\" ");
            }

            // Should Record Desktop Audio
            if (rs.RecordDesktopAudio == "true")
            {
                sb.Append($"-f dshow -i audio=\"{dm.DesktopAudioDevice}\" ");
            }

            // Only check if should seperate tracks if recording desktop and mic, so there is more than 1 input device
            if (rs.RecordDesktopAudio.ToLower() == "true" && rs.AudioDevice.ToLower() != "none")
            {
                // Should seperate audio tracks
                if (rs.SeperateAudioTracks == "true")
                {
                    // Seperate audio tracks
                    sb.Append("-map 0 -map 1 ");
                }
                else
                {
                    // Do not seperate audio tracks
                    sb.Append("-filter_complex \"[0:a:0][1:a:0]amix = 2:longest[aout]\" -map 0:V:0 -map \"[aout]\" ");
                }
            }
            #endregion

            #region FPS
            // Add FPS, if is an integer, otherwise default to 30
            if (rs.FPS.IsInt())
            {
                sb.Append($"-framerate {rs.FPS} ");
            }
            else
            {
                sb.Append($"-framerate 30 ");
            }
            #endregion

            #region Resolution
            // Add resolution/ video - size, default to 1920x1080
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
            #endregion

            #region Other
            // Zero Latency
            if (rs.ZeroLatency == "true")
            {
                sb.Append("-tune zerolatency ");
            }

            // Ultra Fast
            if (rs.UltraFast == "true")
            {
                sb.Append("-preset ultrafast ");
            }
            #endregion

            #region Video Output Location & Format
            // Set format
            sb.Append($"{PathHelper.FolderPath(rs.VideoSaveFolder)}\\");

            switch (rs.Format)
            {
                case "mp4":
                    sb.Append($"out.mp4 ");
                    break;
                case "mkv":
                    sb.Append($"out.mkv "); 
                    break;
            }
            #endregion

            return sb.ToString();
        }
    }
}
