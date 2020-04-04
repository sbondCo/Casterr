using System;
using System.IO;

namespace Casterr.SettingsLib
{
    public class PathHelper
    {
        public string MainFolderPath()
        {
            return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Casterr");
        }

        public string FolderPath(string folder)
        {
            string mainFolder = MainFolderPath();
            string folderWanted = Path.Combine(mainFolder, folder);
            
            // If folder does not exist, create it
            if (!Directory.Exists(folderWanted))
            {
                Directory.CreateDirectory(folderWanted);
            }

            if(folder == "main")
            {
                return mainFolder;
            }

            return folderWanted;
        }

        public string FilePath(string folder, string file)
        {
            string settingsFolder = FolderPath(folder);
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
