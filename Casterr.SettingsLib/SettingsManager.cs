using System.IO;
using System.Reflection;
using Casterr.HelpersLib;
using Newtonsoft.Json;
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

        public void GetAllGeneralSettings()
        {
            GeneralSettings gs = new GeneralSettings();
            JsonHelper jh = new JsonHelper();
            PropertyInfo[] gsProps = typeof(GeneralSettings).GetProperties();

            var file = GetFilePath("GeneralSettings.json");

            // Deserialize JSON in GeneralSettings.json file
            definedSettings = jh.ParseJsonFromFile(file);

            foreach (var prop in gsProps)
            {
                // check if prop.Name exists in definedSettings' index
                // if it does, update its value in GeneralSettings
                if(definedSettings != null)
                {
                    if (definedSettings[prop.Name] != null)
                    {
                        // Set prop to value defined in settings file
                        var newVal = definedSettings.GetValue(prop.Name).ToString();
                        prop.SetValue(gs, newVal);
                    }
                }
            }

            // Add JSON back to file
            jh.SerializeJsonToFile(file, gs);

            // TODO: return list 
        }
    }
}
