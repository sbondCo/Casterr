using Casterr.RecorderLib.FFmpeg;
using System;
using System.Threading.Tasks;

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
        public async Task Start(string args)
        {
            // Append finalPath to the end of arguments
            string finalPath = $"{Environment.GetFolderPath(Environment.SpecialFolder.MyVideos)}\\output.mkv";
            args = $"{args} {finalPath}";

            await process.StartProcess(args);
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
