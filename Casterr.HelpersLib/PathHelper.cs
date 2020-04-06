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
            folder = Path.Combine(mainFolder, folder);
            
            // If folder does not exist, create it
            if (!Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
            }

            return folder;
        }

        public string FilePath(string folder, string file)
        {
            folder = FolderPath(folder);
            file = Path.Combine(folder, file);

            // If settings file doesn't exist, create it
            if (!File.Exists(file))
            {
                File.Create(file).Close();
            }

            return file;
        }
    }
}
