using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace Casterr.RecorderLib.FFmpeg
{
  public class DeviceManager
  {
    public string DesktopVideoDevice = "screen-capture-recorder";
    public string DesktopAudioDevice = "virtual-audio-capturer";

    /// <summary>
    /// Get devices from ffmpeg.
    /// </summary>
    /// <returns>2x List<string> for audio and video devices.</returns>
    public async Task<(List<string>, List<string>)> GetDevices()
    {
      ProcessManager process = new ProcessManager();

      if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
      {
        return await FromWindows(process);
      }
      else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
      {
        return await FromLinux(process);
      }
      
      throw new Exception("OS Not supported currently when getting devices.");
    }

    private async Task<(List<string>, List<string>)> FromLinux(ProcessManager process)
    {
      List<string> audioDevices = new List<string>();
      List<string> videoDevices = new List<string>();

      // Get devices from ffmpeg, exits on its own
      var p = new Process();

      p.StartInfo.FileName = "pactl";
      p.StartInfo.Arguments = "list sources";
      p.StartInfo.CreateNoWindow = true;
      p.StartInfo.RedirectStandardOutput = true;
      p.StartInfo.RedirectStandardError = true;
      p.Start();

      // Console.WriteLine($"Response: std: {p.StandardOutput.ReadToEnd()} stderr: {p.StandardError.ReadToEnd()}");

      var response = p.StandardOutput.ReadToEnd();
      int sourceNumber = 0;

      // If current device is an input device (eg. microphone)
      bool isInputDevice = false;

      // Loop over all lines in response
      foreach (var line in response.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries))
      {
        if (line.ToLower().Contains($"source #")) sourceNumber++;

        if (line.ToLower().Contains($"name: alsa_input")) isInputDevice = true;
        if (line.ToLower().Contains($"name: alsa_output")) isInputDevice = false;

        if (line.ToLower().Contains($"alsa.card_name"))
        {
          if (isInputDevice)
          {
            // Add input devices to audioDevices array
            audioDevices.Add(line.Replace("alsa.card_name = ", "").Replace("\"", ""));
          }
        }
      }

      return (audioDevices, videoDevices);
    }

    private async Task<(List<string>, List<string>)> FromWindows(ProcessManager process)
    {
      List<string> audioDevices = new List<string>();
      List<string> videoDevices = new List<string>();

      // Get devices from ffmpeg, exits on its own
      var response = await process.StartProcess("ffmpeg -list_devices true -f dshow -i dummy", false, true);
      bool isAudioDevice = false;
      Regex rx = new Regex(@"\[dshow @ \w+\]  ""(.+)""", RegexOptions.Compiled | RegexOptions.CultureInvariant);

      // Loop over all lines in response
      foreach (var line in response.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries))
      {
        // Check if next devices to be looked at will be audio or video
        if (line.ToLower().Contains("] directshow video devices"))
        {
          isAudioDevice = false;
          continue;
        }

        if (line.ToLower().Contains("] directshow audio devices"))
        {
          isAudioDevice = true;
          continue;
        }

        // Skip line if it is a device alternate name
        if (line.ToLower().Contains("@device"))
        {
          continue;
        }

        // Check for matches to regex above
        Match match = rx.Match(line);

        if (match.Success)
        {
          // Remove all speech marks from line
          var val = match.Groups[1].Value;

          // If Desktop Screen Video Device, then add to
          // videoDevices under different name
          if (val.ToLower().Contains(DesktopVideoDevice))
          {
            videoDevices.Add("Desktop Screen");
            continue;
          }

          // Skip if DesktopAudioDevice, because this is
          // a toggle in settings, and won't be shown in a ListBox
          if (val.ToLower().Contains(DesktopAudioDevice))
          {
            continue;
          }

          // Add devices to correct List, if they aren't skipped above
          if (isAudioDevice)
          {
            audioDevices.Add(val);
          }
          else
          {
            videoDevices.Add(val);
          }
        }
      }

      return (audioDevices, videoDevices);
    }
  }
}
