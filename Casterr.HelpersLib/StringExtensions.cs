using System.Linq;

namespace Casterr.HelpersLib
{
    public static class StringExtensions
    {
        /// <summary>
        /// Check if string equals any of the targets specified.
        /// </summary>
        /// <param name="value">String to check.</param>
        /// <param name="targets">Targets to check for in string.</param>
        /// <returns>true/false for target(s) found/no target(s) found.</returns>
        public static bool EqualsAnyOf(this string value, params string[] targets)
        {
            return targets.Any(target => target.Equals(value));
        }

        /// <summary>
        /// Check if string is an integer (string is just an int with nothing else).
        /// </summary>
        /// <param name="value">String to check.</param>
        /// <returns>true/false.</returns>
        public static bool IsInt(this string value)
        {
            return int.TryParse(value, out int res);
        }
    }
}
