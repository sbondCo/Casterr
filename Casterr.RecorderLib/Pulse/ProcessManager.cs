using System;
using System.Diagnostics;

namespace Casterr.RecorderLib.Pulse
{
    public class ProcessManager
    {
      public static string StartProcess(string args, bool redirectOutput = false, bool redirectError = false)
      {
        Process p = new Process();

        if (p != null)
        {
          p.StartInfo.FileName = "pactl";
          p.StartInfo.Arguments = args;
          p.StartInfo.CreateNoWindow = true;
          p.StartInfo.RedirectStandardOutput = redirectOutput;
          p.StartInfo.RedirectStandardError = redirectError;
          p.Start();

          // return redirectOutput if set to
          if (redirectOutput)
          {
            var output = p.StandardOutput.ReadToEnd();

            if (!string.IsNullOrEmpty(output)) return output;
          }

          // return redirectError if set to
          if (redirectError)
          {
            var error = p.StandardError.ReadToEnd();

            if (!string.IsNullOrEmpty(error)) return error;
          }
        }
        else
        {
          throw new RecorderException("Could not start pulse");
        }

        return "";
      }
    }
}