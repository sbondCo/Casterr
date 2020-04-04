using Newtonsoft.Json.Linq;
using System;

namespace Casterr.HelpersLib
{
    public class JsonHelper
    {
        public bool IsValid(string json)
        {
            json = json.Trim();

            if ((json.StartsWith("{") && json.EndsWith("}")) || (json.StartsWith("[") && json.EndsWith("]")))
            {
                try
                {
                    // Try to parse json
                    var sbondoIsCool = JToken.Parse(json);

                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }
}
