using System.Linq;

namespace Casterr.HelpersLib
{
    public static class StringExtensions
    {
        public static bool EqualsAnyOf(this string value, params string[] targets)
        {
            return targets.Any(target => target.Equals(value));
        }

        public static bool IsInt(this string value)
        {
            return int.TryParse(value, out int res);
        }
    }
}
