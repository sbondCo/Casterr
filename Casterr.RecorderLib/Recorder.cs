using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Casterr.RecorderLib.FFmpeg;

namespace Casterr.RecorderLib
{
  public class Recorder
  {
    ProcessManager process = new ProcessManager();
    ArgumentBuilder ab = new ArgumentBuilder();
    Dictionary<string, string> args;

    /// <summary>
    /// Start recording.
    /// Gets correct arguments automatically.
    /// </summary>
    public async Task Start()
    {
      // Do before anything else to avoid some task thinking the wrong thing
      // Change status to recording
      RecordingStatus.ChangeStatus(RecordingStatus.Status.Recording);

      // Build args and start recording by sending args to ffmpeg
      args = ab.BuildArgs();
      await process.StartProcess(string.Join(" ", args.Select(x => x.Value)));
    }

    /// <summary>
    /// Stop recording.
    /// </summary>
    public async Task Stop()
    {
      // Stop recording process
      process.StopProcess();

      // Add video to PastRecordings
      await Recordings.Add(args["videoOutput"].Replace("\"", ""));

      // Do after anything else to avoid some task thinking the wrong thing
      // Update recording status to idle, this will automatically reset stopwatch
      RecordingStatus.ChangeStatus(RecordingStatus.Status.Idle);
    }

    /// <summary>
    /// Automatically decide whether to start or stop recording.
    /// Depends on IsRecording.
    /// </summary>
    public async Task Automatic()
    {
      // Start or stop recording depending on 'RecordingStatus.IsRecording'
      if (RecorderLib.RecordingStatus.IsRecording)
      {
        await Stop();
      }
      else
      {
        await Start();
      }
    }
  }
}
