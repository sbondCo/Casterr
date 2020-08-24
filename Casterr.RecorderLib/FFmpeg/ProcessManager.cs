using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Casterr.HelpersLib;

namespace Casterr.RecorderLib.FFmpeg
{
  public class ProcessManager
  {
    private string ffmpegPath;
    private readonly Process ffProcess = new Process();

    /// <summary>
    /// Start new FFmpeg process.
    /// </summary>
    /// <param name="args">Arguments to send FFmpeg process.</param>
    /// <param name="redirectOutput">Should redirect standard output.</param>
    /// <param name="redirectError">Should redirect standard error.</param>
    /// <returns>Nothing/output/error depending on redirectOutput & redirectError</returns>
    public async Task<string> StartProcess(string args, bool redirectOutput = false, bool redirectError = false)
    {
      ffmpegPath = await FindFFmpeg.GetPath();

      // Make sure we have exec rights to ffmpeg executable
      PermissionsHelper.GetExecRights(ffmpegPath);

      if (ffProcess != null)
      {
        ffProcess.StartInfo.FileName = ffmpegPath;
        ffProcess.StartInfo.Arguments = args;
        ffProcess.StartInfo.CreateNoWindow = true;
        ffProcess.StartInfo.RedirectStandardOutput = redirectOutput;
        ffProcess.StartInfo.RedirectStandardError = redirectError;
        ffProcess.StartInfo.RedirectStandardInput = true;
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
      if (ffProcess != null)
      {
        Console.WriteLine("Stopping FFmpeg");

        try
        {
          // Send 'q' to ffmpeg process, which will make it quit
          ffProcess.StandardInput.WriteLine("q");

          // Wait for ffmpeg process to exit
          ffProcess.WaitForExit();
        }
        catch (Exception)
        {
          throw new RecorderException("Error trying to stop recording.");
        }

        Console.WriteLine("Stopped FFmpeg");
      }
      else
      {
        throw new RecorderException("Can't stop recording, when not already recording.");
      }
    }
  }
}
