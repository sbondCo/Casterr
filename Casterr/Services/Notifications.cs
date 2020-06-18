using ElectronNET.API;
using ElectronNET.API.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace Casterr.Services
{
    public static class Notifications
    {
        public static async Task Show(string notifyText)
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
                Movable = false,
                Focusable = false,
                Show = false,
                WebPreferences = new WebPreferences
                {
                    DevTools = false
                }
            };

            // Create new window, load notification page and send data to it
            var notificationWindow = await Electron.WindowManager.CreateWindowAsync(options, $"http://localhost:{BridgeSettings.WebPort}/special/notification/{notifyText}/play");
            notificationWindow.OnReadyToShow += () => notificationWindow.Show();

            // Force close window after 5 seconds
            await Task.Run(() => 
            {
                Thread.Sleep(5000);
                notificationWindow.Destroy();
            });
        }
    }
}
