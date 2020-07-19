using System.Threading.Tasks;
using Casterr.SettingsLib;

namespace Casterr.RecorderLib.FFmpeg
{
    public static class VideoThumbnailer
    {
        public static async Task Create(string videoPath, string videoName)
        {
            ProcessManager process = new ProcessManager();
            SettingsManager sm = new SettingsManager();
            RecordingSettings rs = new RecordingSettings();

            // Get settings
            sm.GetSettings(rs);

            // Get video thumbnail
            await process.StartProcess($"-y -i {videoPath} -ss 1 \"{PathHelper.FolderPath(rs.ThumbSaveFolder) + "\\" + videoName}.png\"");
            process.StopProcess();
        }
    }
}
