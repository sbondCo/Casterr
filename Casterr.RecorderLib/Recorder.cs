using Casterr.RecorderLib.FFmpeg;
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace Casterr.RecorderLib
{
    public class Recorder
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

        string ffmpegPath;
        private Process ffProcess = new Process();

        public async Task Start(string args)
        {
            ffmpegPath = await ff.GetPath();
            //string finalPath = $"{Environment.GetFolderPath(Environment.SpecialFolder.MyVideos)}\\output.mkv";
            //string args = $@"-f dshow -i video='UScreenCapture':audio='Microphone' {finalPath}";

            if (ffProcess != null)
            {
                ffProcess.StartInfo.FileName = ffmpegPath;
                ffProcess.StartInfo.Arguments = args;
                ffProcess.StartInfo.CreateNoWindow = false;
                ffProcess.Start();

                Console.WriteLine("Started FFmpeg");
            }
            else
            {
                throw new RecorderException("Could not start ffmpeg");
            }
        }

        public void Stop()
        {
            try
            {
                if (ffProcess != null)
                {
                    Console.WriteLine("Stopping FFmpeg");

                    AttachConsole(ffProcess.Id);
                    SetConsoleCtrlHandler(IntPtr.Zero, true);
                    GenerateConsoleCtrlEvent(0, 0);

                    Thread.Sleep(2000);

                    SetConsoleCtrlHandler(IntPtr.Zero, false);
                    FreeConsole();

                    Console.WriteLine("Stopped FFmpeg");
                }
                else
                {
                    throw new RecorderException("Can't stop recording, when not already recording");
                }
            }
            catch (Exception)
            {
                throw new RecorderException("Can't stop recording, when not already recording");
            }
        }
    }
}
