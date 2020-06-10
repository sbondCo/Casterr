using System;
using System.Threading.Tasks;
using Casterr.RecorderLib.FFmpeg;

namespace Casterr.RecorderLib
{
    public class Recorder
    {
        ProcessManager process = new ProcessManager();

        /// <summary>
        /// Start FFmpeg process and send arguments to it.
        /// </summary>
        /// <param name="args">Arguments to send FFmpeg.</param>
        /// <returns></returns>
        public async Task Start()
        {
            // Append finalPath to the end of arguments
            // string finalPath = $"{Environment.GetFolderPath(Environment.SpecialFolder.MyVideos)}\\output.mkv";
            ArgumentBuilder ag = new ArgumentBuilder();

            var p = await process.StartProcess(ag.BuildArgs());
        }

        /// <summary>
        /// Stop FFmpeg process.
        /// </summary>
        public void Stop()
        {
            process.StopProcess();
        }
    }
}
