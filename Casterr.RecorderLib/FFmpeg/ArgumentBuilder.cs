using System.Text;
using System.IO;
using System.Collections.Generic;
using Casterr.SettingsLib;
using Casterr.HelpersLib;
using System;
using System.Runtime.InteropServices;
using System.Linq;

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

    /// <summary>
    /// Build ffmpeg args for Linux
    /// </summary>
    /// <returns>FFmpeg arguments for recording</returns>
    public Dictionary<string, string> ForLinux(Dictionary<string, string> d, RecordingSettings rs, DeviceManager dm)
    {
      #region Add Pulse Inputs
      // Add audio devices
      foreach (var ad in rs.AudioDevicesToRecord)
      {
        d.Add($"pulse{ad.SourceNumber}", $"-f pulse -i {ad.SourceNumber}");
      }
      #endregion

      #region Video Settings
      // Put video settings before x11grab device to make sure they actually apply

      // Recording FPS
      d.Add("fps", $"-framerate {GetFPS(rs.FPS)}");

      // Recording Resolution
      d.Add("res", $"-video_size {GetResolution(rs.Resolution)}");

      // Add x11grab
      d.Add("x11grab", $"-f x11grab");

      // Region on desktop to record
      d.Add("desktopRegion", "-i :0.0+0,0");
      #endregion

      #region Audio mapping
      // Should seperate audio tracks
      if (rs.SeperateAudioTracks == "true")
      {
        // Map audio/video
        // Plus one to also map desktop recording
        for (var i = 0; i < rs.AudioDevicesToRecord.Count() + 1; ++i)
        {
          d.Add($"map{i}", $"-map {i}");
        }
      }
      else
      {
        // Use StringBuilder to contruct argument that records to one track
        StringBuilder sa = new StringBuilder();

        // Minus 2 from cap as to not include recording desktop
        int cap = rs.AudioDevicesToRecord.Count();

        sa.Append("-filter_complex \"");

        for (var i = 0; i < cap; ++i)
        {
          sa.Append($"[{i}:a:0]");
        }
        
        sa.Append($"amix = {cap}:longest[aout]\"");
        sa.Append($" -map {cap}:V:0 -map \"[aout]\"");

        d.Add("maps", sa.ToString());
      }
      #endregion

      // Video output path
      d.Add("videoOutput", $"\"{GetVideoOutput(PathHelper.FolderPath(rs.VideoSaveFolder), DateTimeCodeConverter.Convert(rs.VideoSaveName), GetVideoFormat(rs.Format))}\"");

      return d;
    }

    /// <summary>
    /// Build ffmpeg args for Windows
    /// </summary>
    /// <returns>FFmpeg arguments for recording</returns>
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

    /// <summary>
    /// Get video output path
    /// </summary>
    /// <param name="folder">Folder to save file</param>
    /// <param name="name">Name of file to save</param>
    /// <param name="format">Format of file to save</param>
    /// <returns></returns>
    private string GetVideoOutput(string folder, string name, string format)
    {
      return Path.Combine(folder, $"{name}.{format}");
    }

    /// <summary>
    /// Get video format - Default to MP4
    /// </summary>
    /// <param name="fmt">Video format</param>
    /// <returns>Video format</returns>
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

    /// <summary>
    /// Get Recording FPS
    /// </summary>
    /// <param name="fps">Recording FPS</param>
    /// <returns>Recording FPS</returns>
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

    /// <summary>
    /// Get resolution to record in
    /// </summary>
    /// <param name="resolution">Resolution</param>
    /// <returns>Resolution</returns>
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
