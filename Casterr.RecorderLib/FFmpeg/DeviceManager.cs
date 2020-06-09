using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Casterr.RecorderLib.FFmpeg
{
    public class DeviceManager
    {
        public string DesktopVideoDevice = "screen-capture-recorder";
        public string DesktopAudioDevice = "virtual-audio-capturer";

        public async Task<(List<string>, List<string>)> GetDevices()
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
