using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace Casterr.RecorderLib.FFmpeg
{
    public class ProcessManager
    {
        [DllImport("kernel32.dll")]
        public static extern bool GenerateConsoleCtrlEvent(int dwCtrlEvent, int dwProcessGroupId);
        [DllImport("kernel32.dll")]
        public static extern bool SetConsoleCtrlHandler(IntPtr handlerRoutine, bool add);
        [DllImport("kernel32.dll")]
        public static extern bool AttachConsole(int dwProcessId);
        [DllImport("kernel32.dll")]
        public static extern bool FreeConsole();

        FindFFmpeg ff = new FindFFmpeg();

        private string ffmpegPath;
        private readonly Process ffProcess = new Process();

        /// <summary>
        /// Start new FFmpeg process.
        /// </summary>
        /// <param name="args">Arguments to send FFmpeg process.</param>
        /// <param name="redirectOutput">Should redirect standard output.</param>
        /// <param name="redirectError">Should redirect standard error.</param>
        /// <returns></returns>
        public async Task<string> StartProcess(string args, bool redirectOutput = false, bool redirectError = false)
        {
            ffmpegPath = await ff.GetPath();

            if (ffProcess != null)
            {
                ffProcess.StartInfo.FileName = ffmpegPath;
                ffProcess.StartInfo.Arguments = args;
                ffProcess.StartInfo.CreateNoWindow = true;
                ffProcess.StartInfo.RedirectStandardOutput = redirectOutput;
                ffProcess.StartInfo.RedirectStandardError = redirectError;
                ffProcess.Start();

                Console.WriteLine("Started FFmpeg");

                // return redirectOutput if set to
                if (redirectOutput)
                {
                    var output = ffProcess.StandardOutput.ReadToEnd();

                    if (!string.IsNullOrEmpty(output)) return output;
                }

                // return redirectError if set to
                if (redirectError)
                {
                    var error = ffProcess.StandardError.ReadToEnd();

                    if (!string.IsNullOrEmpty(error)) return error;
                }
            }
            else
            {
                throw new RecorderException("Could not start ffmpeg");
            }

            return "";
        }

        /// <summary>
        /// Stop FFmpeg process.
        /// </summary>
        public void StopProcess()
        {
            try
            {
                if (ffProcess != null)
                {
                    Console.WriteLine("Stopping FFmpeg");

                    // Try closing process twice
                    // Temporary solution
                    int i = 0;
                    while (i <= 1)
                    {
                        AttachConsole(ffProcess.Id);
                        SetConsoleCtrlHandler(IntPtr.Zero, true);
                        GenerateConsoleCtrlEvent(0, 0);

                        Thread.Sleep(2000);

                        SetConsoleCtrlHandler(IntPtr.Zero, false);
                        FreeConsole();

                        i++;
                    }

                    Console.WriteLine("Stopped FFmpeg");
                }
                else
                {
                    throw new RecorderException("Can't stop recording, when not already recording.");
                }
            }
            catch (Exception)
            {
                throw new RecorderException("Can't stop recording, when not already recording.");
            }
        }
    }
}
