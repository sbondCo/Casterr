using ElectronNET.API;
using ElectronNET.API.Entities;
using System.Threading.Tasks;

namespace Casterr.Services
{
    public class Notifications
    {
        public async Task Show(string notifyText)
        {
            var disp = await Electron.Screen.GetPrimaryDisplayAsync();

            // Options for new window
            var options = new BrowserWindowOptions
            {
                Width = 400,
                Height = 80,
                X = disp.Size.Width - 400,
                Y = 50,
                Frame = false,
                SkipTaskbar = true,
                AlwaysOnTop = true,
                Resizable = false,
                HasShadow = false,
                Transparent = true,
                WebPreferences = new WebPreferences
                {
                    DevTools = false
                }
            };

            // Create new window, load notification page and send data to it
            var notificationWindow = Electron.WindowManager.CreateWindowAsync(options, $"http://localhost:{BridgeSettings.WebPort}/special/notification/{notifyText}");
        }
    }
}
