using System.Text;
using System.Collections.Generic;
using Casterr.SettingsLib;
using Casterr.HelpersLib;
using System;
using System.Runtime.InteropServices;

namespace Casterr.RecorderLib.FFmpeg
{
  public class ArgumentBuilder
  {
    /// <summary>
    /// Build arguments from RecordingSettings for ffmpeg
    /// </summary>
    public Dictionary<string, string> BuildArgs()
    {
      SettingsManager sm = new SettingsManager();
      RecordingSettings rs = new RecordingSettings();
      DeviceManager dm = new DeviceManager();
      Dictionary<string, string> d = new Dictionary<string, string>();

      // Get settings
      sm.GetSettings(rs);

      if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
      {
        return ForWindows(d, rs, dm);
      }
      else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
      {
        return ForLinux(d, rs, dm);
      }

      return d;
    }

    public Dictionary<string, string> ForLinux(Dictionary<string, string> d, RecordingSettings rs, DeviceManager dm)
    {
      // Add audio devices
      foreach (var ad in rs.AudioDevicesToRecord)
      {
        d.Add($"pulse{ad.SourceNumber}", $"-f pulse -i {ad.SourceNumber}");
      }

      // Add x11grab
      d.Add("x11grab", $"-f x11grab");

      d.Add("fps", $"-framerate {GetFPS(rs.FPS)}");

      d.Add("res", $"-video_size {GetResolution(rs.Resolution)}");

      d.Add("videoOutput", $"\"{GetVideoOutput(PathHelper.FolderPath(rs.VideoSaveFolder), DateTimeCodeConverter.Convert(rs.VideoSaveName), GetVideoFormat(rs.Format))}\"");

      

      return d;
    }

    public Dictionary<string, string> ForWindows(Dictionary<string, string> d, RecordingSettings rs, DeviceManager dm)
    {
      #region Add DirectShow and Configure Audio
      // Add directshow
      d.Add("dshow", $"-f dshow");

      // Add video device
      string videoDevice;

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

        videoDevice = $"-i video=\"{dm.DesktopVideoDevice}\"{audio}";
      }
      else
      {
        videoDevice = $"-i video=\"{rs.VideoDevice}\"";
      }

      d.Add("videoDevice", videoDevice);

      // Should Record Desktop Audio
      if (rs.RecordDesktopAudio == "true")
      {
        d.Add("recordDesktopAudio", $"-f dshow -i audio=\"{dm.DesktopAudioDevice}\"");
      }

      // Only check if should seperate tracks if recording desktop and mic, so there is more than 1 input device
      if (rs.RecordDesktopAudio.ToLower() == "true" && rs.AudioDevice.ToLower() != "none")
      {
        string seperateAudioTracks;

        // Should seperate audio tracks
        if (rs.SeperateAudioTracks == "true")
        {
          // Seperate audio tracks
          seperateAudioTracks = "-map 0 -map 1";
        }
        else
        {
          // Do not seperate audio tracks
          seperateAudioTracks = "-filter_complex \"[0:a:0][1:a:0]amix = 2:longest[aout]\" -map 0:V:0 -map \"[aout]\"";
        }

        d.Add("seperateAudioTracks", seperateAudioTracks);
      }
      #endregion

      #region FPS
      // Add FPS if it's an integer, otherwise default to 30
      d.Add("fps", $"-framerate {GetFPS(rs.FPS)}");
      #endregion

      #region Resolution
      d.Add("res", $"-video_size {GetResolution(rs.Resolution)}");
      #endregion

      #region Other
      // Zero Latency
      if (rs.ZeroLatency == "true")
      {
        d.Add("tune", "-tune zerolatency");
      }

      // Ultra Fast
      if (rs.UltraFast == "true")
      {
        d.Add("preset", "-preset ultrafast");
      }
      #endregion

      #region Video Output Location & Format
      d.Add("videoOutput", $"\"{GetVideoOutput(PathHelper.FolderPath(rs.VideoSaveFolder), DateTimeCodeConverter.Convert(rs.VideoSaveName), GetVideoFormat(rs.Format))}\"");
      #endregion

      return d;
    }

    private string GetVideoOutput(string folder, string name, string format)
    {
      StringBuilder vo = new StringBuilder();

      vo.Append(folder);
      vo.Append(name);
      vo.Append("." + format);

      return vo.ToString();
    }

    private string GetVideoFormat(string fmt)
    {
      // Default format to mp4
      var format = "mp4";

      switch (fmt)
      {
        case "mp4":
          format = "mp4";
          break;
        case "mkv":
          format = "mkv";
          break;
      }

      return format;
    }

    private int GetFPS(string fps)
    {
      if (fps.IsInt())
      {
        return Int32.Parse(fps);
      }
      else
      {
        // Default to 30 fps is fps input is not a number
        return 30;
      }
    }

    private string GetResolution(string resolution)
    {
      // Default to 1920x1080
      string res = "1920x1080";

      switch (resolution)
      {
        case "In-Game":
          throw new NotImplementedException();
        case "2160p":
          res = "3840x2160";
          break;
        case "1440p":
          res = "2560x1440";
          break;
        case "1080p":
          res = "1920x1080";
          break;
        case "720p":
          res = "1280x720";
          break;
        case "480p":
          res = "640x480";
          break;
        case "360p":
          res = "480x360";
          break;
      }

      return res;
    }
  }
}
