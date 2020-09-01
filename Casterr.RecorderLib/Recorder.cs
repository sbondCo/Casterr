using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Casterr.HelpersLib;
using Casterr.RecorderLib.FFmpeg;

namespace Casterr.RecorderLib
{
  public class Recorder
  {
    ProcessManager process = new ProcessManager();
    ArgumentBuilder ab = new ArgumentBuilder();
    Dictionary<string, string> args;

    /// <summary>
    /// Start FFmpeg process and send arguments to it.
    /// </summary>
    /// <param name="args">Arguments to send FFmpeg.</param>
    /// <returns></returns>
    public async Task Start()
    {
      // Build args and start recording by sending args to ffmpeg
      // args = ab.BuildArgs();
      // await process.StartProcess(string.Join(" ", args.Select(x => x.Value)));

      // Change status to recording
      RecordingStatus.ChangeStatus(RecordingStatus.Status.Recording);
    }

    /// <summary>
    /// Stop FFmpeg process.
    /// </summary>
    public async Task Stop()
    {
      // // Stop recording process
      // process.StopProcess();

      // // Add video to PastRecordings
      // await Recordings.Add(args["videoOutput"].Replace("\"", ""));

      // Update recording status to idle, this will automatically reset stopwatch
      RecordingStatus.ChangeStatus(RecordingStatus.Status.Idle);
    }
  }
}
