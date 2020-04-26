namespace Casterr.SettingsLib
{
    public class RecordingSettings
    {
        #region Video
        public string FPS { get; set; } = "60";
        public string Resolution { get; set; } = "In-Game";
        public string Format { get; set; } = "mp4";
        public string ZeroLatency { get; set; } = "true";
        public string UltraFast { get; set; } = "true";
        #endregion

        #region Audio
        public string AudioDevice { get; set; } = "default";
        public string SeperateAudioTracks { get; set; } = "false";
        #endregion
    }
}
