using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Casterr.SettingsLib
{
    class Paths
    {
        private string FolderPath(string folder)
        {
            string mainFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Casterr");
            string folderWanted = Path.Combine(mainFolder, folder);
            
            // If folder does not exist, create it
            if (!Directory.Exists(folderWanted))
            {
                Directory.CreateDirectory(folderWanted);
            }

            // Return main folder if asked for
            if (folder == "main")
            {
                return mainFolder;
            }

            return folderWanted;
        }

        public string FilePath(string file)
        {
            string settingsFolder = FolderPath("settings");
            string settingsFile = Path.Combine(settingsFolder, file);

            // If settings file doesn't exist, create it
            if (!File.Exists(settingsFile))
            {
                File.Create(settingsFile);
            }

            return settingsFile;
        }
    }
}
