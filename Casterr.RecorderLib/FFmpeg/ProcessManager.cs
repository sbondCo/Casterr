using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Casterr.HelpersLib;

namespace Casterr.RecorderLib.FFmpeg
{
  public class ProcessManager
  {
    private readonly Process ffProcess = new Process();

    /// <summary>
    /// Start new FFmpeg or FFprobe process.
    /// </summary>
    /// <param name="which">Which process to start (ffmpeg or ffprobe).</param>
    /// <param name="args">Arguments to send the process.</param>
    /// <param name="redirectOutput">Should redirect standard output.</param>
    /// <param name="redirectError">Should redirect standard error.</param>
    /// <returns>Nothing/output/error depending on redirectOutput & redirectError.</returns>
    public async Task<string> StartProcess(string args, string which = "ffmpeg", bool redirectOutput = false, bool redirectError = false)
    {
      // Get path to correct executable that is going to be used
      string ffPath;
      if (which.ToLower() == "ffprobe")
      {
        ffPath = await FindFFmpeg.GetPath("ffprobe");
      }
      else
      {
        // Default to ffmpeg path
        ffPath = await FindFFmpeg.GetPath("ffmpeg");
      }

      // Make sure we have exec rights
      PermissionsHelper.GetExecRights(ffPath);

      if (ffProcess != null)
      {
        ffProcess.StartInfo.FileName = ffPath;
        ffProcess.StartInfo.Arguments = args;
        ffProcess.StartInfo.CreateNoWindow = true;
        ffProcess.StartInfo.RedirectStandardOutput = redirectOutput;
        ffProcess.StartInfo.RedirectStandardError = redirectError;
        ffProcess.StartInfo.RedirectStandardInput = true;
        ffProcess.Start();

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
        throw new RecorderException($"Could not start {which}");
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
      }
      else
      {
        throw new RecorderException("Can't stop recording, when not already recording.");
      }
    }
  }
}
