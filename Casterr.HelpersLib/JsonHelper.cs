using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;

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

        public JObject ParseJsonFromFile(string file)
        {
            string json;
            JObject parsedJson = null;

            using (StreamReader sr = File.OpenText(file))
            {
                // Get json from file
                json = sr.ReadToEnd();

                // Parse json, if valid
                if (IsValid(json))
                {
                    parsedJson = JObject.Parse(json);
                }

                sr.Dispose();
                sr.Close();
            }

            return parsedJson;
        }

        public void SerializeJsonToFile(string file, object obj)
        {
            string json;

            using (StreamWriter sw = new StreamWriter(file))
            {
                // Serialize json
                json = JsonConvert.SerializeObject(obj, Formatting.Indented);

                // Write json back to file
                sw.WriteLine(json);

                sw.Dispose();
                sw.Close();
            }
        }
    }
}
