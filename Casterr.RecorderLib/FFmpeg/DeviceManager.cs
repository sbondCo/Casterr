using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Casterr.RecorderLib.FFmpeg
{
    public class DeviceManager
    {
        public async Task GetDevices()
        {
            ProcessManager process = new ProcessManager();

            // Get devices from ffmpeg, exits on its own
            await process.StartProcess("ffmpeg -list_devices true -f dshow -i dummy", true, true);
            string response = process.ProcessError;

            // Parse response
            List<string> audioDevices = new List<string>();
            List<string> videoDevices = new List<string>();

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

                // Skip line if it is a device that we installed
                if (line.ToLower().Contains("screen-capture-recorder") || line.ToLower().Contains("virtual-audio-capturer"))
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
