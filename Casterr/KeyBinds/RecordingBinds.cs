using System;
using ElectronNET.API;
using Casterr.SettingsLib;

namespace Casterr.HelpersLib.KeyBinds
{
    public class RecordingBinds
    {
        public void RegisterAll()
        {
            KeyBindingSettings ks = new KeyBindingSettings();

            Electron.GlobalShortcut.Register(ks.StartStopRecording, () =>
            {
                Console.WriteLine("StartStopRecording pressed");
            });
        }
    }
}
