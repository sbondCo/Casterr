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
            return PathHelper.FilePath("settings", file);
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
            else if (obj.GetType().Name == "KeyBindingSettings")
            {
                file = GetFilePath("KeyBindingSettings.json");
            }
            else
            {
                throw new Exception("That object is not supported.");
            }

            return file;
        }

        /// <summary>
        /// Get Settings from json file related to obj and set settings in obj to what they are in json file
        /// </summary>
        /// <param name="obj">object with settings defined</param>
        public void GetSettings(object obj)
        {
            JsonHelper jh = new JsonHelper();
            PropertyInfo[] objProps = obj.GetType().GetProperties();

            string file = GetObjectTypeFile(obj);

            // Deserialize JSON in GeneralSettings.json file
            definedSettings = jh.ParseJsonFromFile(file);

            foreach (var prop in objProps)
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

            // Serialize json back to file in case of missing rules
            jh.SerializeJsonToFile(file, obj);
        }

        /// <summary>
        /// Get variables from obj, serialize them and (re)write them to json file related to obj
        /// </summary>
        /// <param name="obj">object with settings defined</param>
        public void UpdateSettingsFile(object obj)
        {
            JsonHelper jh = new JsonHelper();

            string file = GetObjectTypeFile(obj);

            // Serialize json to file
            jh.SerializeJsonToFile(file, obj);
        }
    }
}
