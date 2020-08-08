using System;
using System.IO;

namespace Casterr.SettingsLib
{
  public static class PathHelper
  {
    /// <summary>
    /// Main folder for Casterr.
    /// </summary>
    /// <returns>Folder.</returns>
    public static string MainFolderPath()
    {
      return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Casterr");
    }

    /// <summary>
    /// Check if folder exists, if it doesn't then it creates it.
    /// </summary>
    /// <param name="folder">Path to folder.</param>
    /// <returns>folder.</returns>
    public static string FolderPath(string folder)
    {
      // If folder does not exist, create it
      if (!Directory.Exists(folder))
      {
        Directory.CreateDirectory(folder);
      }

      return folder;
    }

    /// <summary>
    /// Check if file/directory it is in exists, if they don't then it creates them.
    /// </summary>
    /// <param name="folder">Folder to look in.</param>
    /// <param name="file">File to look for in folder.</param>
    /// <returns>file</returns>
    public static string FilePath(string folder, string file)
    {
      file = Path.Combine(FolderPath(folder), file);

      // If settings file doesn't exist, create it
      if (!File.Exists(file))
      {
        File.Create(file).Close();
      }

      return file;
    }
  }
}
