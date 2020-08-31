using System;

namespace Casterr.HelpersLib
{
  public static class LongExtensions
  {
    /// <summary>
    /// Convert byte count to readable format
    /// </summary>
    /// <returns>Bytes in readable file size format</returns>
    public static string ToReadableFileSize(this long b)
    {
      string[] sizes = { "B", "KB", "MB", "GB", "TB", "PB", "EB" };
      b = Math.Abs(b);

      // If b is 0 then return correct data manually to avoid overflow exception
      if (b == 0) return $"0 {sizes[0]}";

      // Get index of sizes[] to use
      int place = Convert.ToInt32(Math.Floor(Math.Log(b, 1024)));

      // Get number to use with size
      double num = Math.Round(b / Math.Pow(1024, place), 1);

      return $"{(Math.Sign(b) * num)} {sizes[place]}";
    }
  }
}