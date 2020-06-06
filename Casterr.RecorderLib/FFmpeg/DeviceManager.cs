using System;
using System.Threading.Tasks;

namespace Casterr.RecorderLib.FFmpeg
{
    public class DeviceManager
    {
        public async Task GetDevices()
        {
            ProcessManager process = new ProcessManager();

            // Get devices from ffmpeg, should exit on its own
            await process.StartProcess("ffmpeg -list_devices true -f dshow -i dummy", true, true);
            string devices = process.ProcessOutput;
            string errorz = process.ProcessError;

            Console.WriteLine($"devices: {devices}, errorz: {errorz}");
        }
    }
}
