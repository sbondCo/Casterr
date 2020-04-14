using System;
using System.Reflection;
using Casterr.HelpersLib;
using Newtonsoft.Json.Linq;

namespace Casterr.SettingsLib
{
    public class SettingsManager
    {
        JObject definedSettings;

        public string GetFilePath(string file)
        {
            PathHelper ph = new PathHelper();

            return ph.FilePath("settings", file);
        }

        public string GetObjectTypeFile(object obj)
        {
            string file;

            if (obj.GetType().Name == "GeneralSettings")
            {
                file = GetFilePath("GeneralSettings.json");
            }
            else if (obj.GetType().Name == "RecordingSettings")
            {
                file = GetFilePath("RecordingSettings.json");
            }
            else
            {
                throw new Exception("That object is not supported.");
            }

            return file;
        }

        public void GetSettings(object obj)
        {
            JsonHelper jh = new JsonHelper();
            PropertyInfo[] gsProps = typeof(GeneralSettings).GetProperties();

            string file = GetObjectTypeFile(obj);

            // Deserialize JSON in GeneralSettings.json file
            definedSettings = jh.ParseJsonFromFile(file);

            foreach (var prop in gsProps)
            {
                // check if prop.Name exists in definedSettings' index
                // if it does, update its value in GeneralSettings
                if (definedSettings != null)
                {
                    if (definedSettings[prop.Name] != null)
                    {
                        // Set prop to value defined in settings file
                        var newVal = definedSettings.GetValue(prop.Name).ToString();
                        prop.SetValue(obj, newVal);
                    }
                }
            }

            // Add JSON back to file
            jh.SerializeJsonToFile(file, obj);
        }

        public void UpdateSettings(object obj)
        {
            JsonHelper jh = new JsonHelper();

            string file = GetObjectTypeFile(obj);

            // Serialize json to file
            jh.SerializeJsonToFile(file, obj);
        }
    }
}
