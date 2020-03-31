using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Casterr.SettingsLib
{
    public class GeneralSettings
    {
        public string GetFile()
        {
            Paths p = new Paths();

            return p.FilePath("GeneralSettings.json");
        }
    }
}
