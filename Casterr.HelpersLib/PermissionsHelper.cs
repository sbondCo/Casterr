using System.IO;
using System.Runtime.InteropServices;
using Mono.Unix;

namespace Casterr.HelpersLib
{
  public static class PermissionsHelper
  {
    /// <summary>
    /// Get exec rights to a file (Only does anything if on linux)
    /// </summary>
    /// <param name="filePath">Path to file</param>
    public static void GetExecRights(string filePath)
    {
      // Only get exec rights if on linux
      if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
      {
        if (File.Exists(filePath))
        {
          var fileInfo = new Mono.Unix.UnixFileInfo(filePath);
          fileInfo.FileAccessPermissions = FileAccessPermissions.UserExecute;
        }
      }
    }
  }
}