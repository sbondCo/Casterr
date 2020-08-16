using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Runtime.InteropServices;

namespace Casterr.RecorderLib.FFmpeg
{
  public class Device
  {
    public string Name { get; set; }
    public bool IsInput { get; set; }
  }

  public class DeviceManager
  {
    public string DesktopVideoDevice = "screen-capture-recorder";
    public string DesktopAudioDevice = "virtual-audio-capturer";

    /// <summary>
    /// Get devices from ffmpeg.
    /// </summary>
    /// <returns>2x List<string> for audio and video devices.</returns>
    public async Task<(List<Device>, List<string>)> GetDevices()
    {
      if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
      {
        // return await FromWindows();
      }
      else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
      {
        return FromLinux();
      }
      
      throw new Exception("OS Not supported currently when getting devices.");
    }

    /// <summary>
    /// Get devices in a way that works on Linux
    /// </summary>
    /// <returns>Users devices</returns>
    private (List<Device>, List<string>) FromLinux()
    {
      List<Device> audioDevices = new List<Device>();
      List<string> videoDevices = new List<string>();

      var response = Pulse.ProcessManager.StartProcess("list sources", true);

      // If current device is an input device (eg. microphone)
      bool isInputDevice = false;

      // Loop over all lines in response
      foreach (var line in response.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries))
      {
        if (line.ToLower().Contains($"name: alsa_input")) isInputDevice = true;
        if (line.ToLower().Contains($"name: alsa_output")) isInputDevice = false;

        if (line.ToLower().Contains($"alsa.card_name"))
        {
          // Add input devices to audioDevices array
          audioDevices.Add(
            new Device{ 
              Name = line
                      .Replace("alsa.card_name = ", "")
                      .Replace("\"", "")
                      .Replace("\t", ""), 
              IsInput = isInputDevice 
            }
          );
        }
      }

      return (audioDevices, videoDevices);
    }

    /// <summary>
    /// Get devices in a way that works on Windows
    /// </summary>
    /// <returns>Users devices</returns>
    private async Task<(List<string>, List<string>)> FromWindows()
    {
      ProcessManager process = new ProcessManager();

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
