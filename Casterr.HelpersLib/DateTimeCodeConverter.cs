using System;
using System.Collections.Generic;
using System.Text;

namespace Casterr.HelpersLib
{
  public static class DateTimeCodeConverter
  {
    /// <summary>
    /// Convert Date/Time codes in a string to actual Date/Time values
    /// </summary>
    /// <param name="tc">String with codes to convert</param>
    /// <returns>Converted string (ex. if tc = "%d.%m.%Y", output = "16/09/2020")</returns>
    public static string Convert(string tc)
    {
      // https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings

      DateTime now = DateTime.Now;

      #region Day
      // Day of the month, 01 to 31
      if (tc.Contains("%d"))
      {
        tc = tc.Replace("%d", now.ToString("dd"));
      }

      // Abbreviated day of the week, Mon to Sun
      if (tc.Contains("%D"))
      {
        tc = tc.Replace("%D", now.ToString("ddd"));
      }

      // Full day of the week, Monday to Sunday (%l = lowercase L)
      if (tc.Contains("%l"))
      {
        tc = tc.Replace("%l", now.ToString("dddd"));
      }
      #endregion

      #region Month
      // Numeric representation of the month, 01 to 12
      if (tc.Contains("%m"))
      {
        tc = tc.Replace("%m", now.ToString("MM"));
      }

      // Abbreviated month, Jan to Dec
      if (tc.Contains("%M"))
      {
        tc = tc.Replace("%M", now.ToString("MMM"));
      }

      // Full month, January to December
      if (tc.Contains("%F"))
      {
        tc = tc.Replace("%F", now.ToString("MMMM"));
      }
      #endregion

      #region Year
      // Two digit representation of the year, 80 or 20
      if (tc.Contains("%y"))
      {
        tc = tc.Replace("%y", now.ToString("yy"));
      }

      // Full numeric representation of the year, 1980 or 2020
      if (tc.Contains("%Y"))
      {
        tc = tc.Replace("%Y", now.ToString("yyyy"));
      }
      #endregion

      #region Time
      // Hour of the day (12-hour format), 01 to 12
      if (tc.Contains("%h"))
      {
        tc = tc.Replace("%h", now.ToString("hh"));
      }

      // Hour of the day (24-hour format), 00 to 23
      if (tc.Contains("%H"))
      {
        tc = tc.Replace("%H", now.ToString("HH"));
      }

      // Minutes since start of the hour, 00 to 59
      if (tc.Contains("%i"))
      {
        tc = tc.Replace("%i", now.ToString("mm"));
      }

      // Seconds since start of the minute, 00 to 59
      if (tc.Contains("%s"))
      {
        tc = tc.Replace("%s", now.ToString("ss"));
      }

      // Lowercase Ante Meridiem and Post Meridiem, am or pm
      if (tc.Contains("%a"))
      {
        tc = tc.Replace("%a", now.ToString("tt").ToLower());
      }

      // Uppercase Ante Meridiem and Post Meridiem, AM or PM
      if (tc.Contains("%A"))
      {
        tc = tc.Replace("%A", now.ToString("tt"));
      }
      #endregion

      #region Timezone
      // Difference to Greenwich time, +0100
      if (tc.Contains("%O"))
      {
        tc = tc.Replace("%O", now.ToString("zzz").Replace(":", ""));
      }
      #endregion

      return tc;
    }
  }
}
