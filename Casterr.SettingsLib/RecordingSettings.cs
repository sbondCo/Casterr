using System.Collections.Generic;
using System;
using System.IO;

namespace Casterr.SettingsLib
{
  public class AudioDeviceToRecord
  {
    public int SourceNumber { get; set; }
    public string Name { get; set; }
  }

  public class RecordingSettings
  {
    #region General
    public string ThumbSaveFolder { get; set; } = $"{Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Casterr", "Thumbs")}";
    public string VideoSaveFolder { get; set; } = $"{Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyVideos), "Casterr")}";
    public string VideoSaveName { get; set; } = "%d.%m.%Y - %H.%i.%s";
    #endregion

    #region Video
    public string VideoDevice { get; set; } = "Default";
    public string FPS { get; set; } = "60";
    public string Resolution { get; set; } = "In-Game";
    public string Format { get; set; } = "mp4";
    public string ZeroLatency { get; set; } = "true";
    public string UltraFast { get; set; } = "true";
    #endregion

    #region Audio
    public List<AudioDeviceToRecord> AudioDevicesToRecord { get; set; } = new List<AudioDeviceToRecord> { };
    public string AudioDevice { get; set; } = "Default";
    public string SeperateAudioTracks { get; set; } = "false";
    public string RecordDesktopAudio { get; set; } = "true";
    #endregion
  }
}
