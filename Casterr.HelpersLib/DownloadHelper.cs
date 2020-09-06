using System;
using System.Net;
using System.Threading.Tasks;

namespace Casterr.HelpersLib
{
  public delegate void DownloadProgressChanged(int percentage);

  public static class DownloadHelper
  {
    public static event DownloadProgressChanged ProgressChanged;

    /// <summary>
    /// Download file to savePath
    /// </summary>
    /// <param name="uri">URI to fetch file from</param>
    /// <param name="savePath">Path to save downloaded file to</param>
    public static async Task Download(Uri uri, string savePath)
    {
      var wc = new WebClient();
      
      wc.DownloadProgressChanged += new DownloadProgressChangedEventHandler(InvokeProgressChanged);

      await wc.DownloadFileTaskAsync(uri, savePath);
    }

    private static void InvokeProgressChanged(object sender, DownloadProgressChangedEventArgs e)
    {
      ProgressChanged?.Invoke(e.ProgressPercentage);
    }
  }
}
