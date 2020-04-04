namespace Casterr.SettingsLib
{
    public class RecordingSettings
    {
        #region Video
        public int FPS { get; set; } = 60;
        public string Resolution { get; set; } = "1920x1080";
        public string Format { get; set; } = "mp4";
        public bool ZeroLatency { get; set; } = true;
        public bool UltraFast { get; set; } = true;
        #endregion

        #region Audio
        public string AudioDevice { get; set; } = "default";
        public bool SeperateAudioTracks { get; set; } = false;
        #endregion
    }
}
