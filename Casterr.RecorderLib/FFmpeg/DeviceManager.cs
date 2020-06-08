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

        public async Task GetDevices()
        {
            ProcessManager process = new ProcessManager();

            List<string> audioDevices = new List<string>();
            List<string> videoDevices = new List<string>();

            // Get devices from ffmpeg, exits on its own
            var response = await process.StartProcess("ffmpeg -list_devices true -f dshow -i dummy", false, true);

            // Get everything inside speech marks
            Regex rx = new Regex("\".+?\"", RegexOptions.Compiled | RegexOptions.CultureInvariant);

            MatchCollection matches = rx.Matches(response);

            foreach (Match match in matches)
            {
                // Remove all speech marks from line
                var line = match.ToString().Replace("\"", "");

                // Skip line if it is a device alternate name
                if (line.ToLower().Contains("@device"))
                {
                    continue;
                }

                // Desktop Screen Video Device
                if (line.ToLower().Contains(DesktopVideoDevice))
                {
                    videoDevices.Add("Desktop Screen");
                    continue;
                }

                // Skip if DesktopAudioDevice, because this is a toggle
                if (line.ToLower().Contains(DesktopAudioDevice))
                {
                    continue;
                }

                // Check if device is mic
                if (line.ToLower().Contains("microphone"))
                {
                    audioDevices.Add(line);
                }
                else
                {
                    // If not mic, then must be video device
                    videoDevices.Add(line);
                }
            }
        }
    }
}
