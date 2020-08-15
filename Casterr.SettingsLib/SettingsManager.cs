using System.Collections.Generic;
using System;
using System.IO;
using System.Reflection;
using Casterr.HelpersLib;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace Casterr.SettingsLib
{
  public class SettingsManager
  {
    JObject definedSettings;

    public string GetFilePath(string file)
    {
      return PathHelper.FilePath($"{Path.Combine(PathHelper.MainFolderPath(), "settings")}", file);
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
      PropertyInfo[] objProps = obj.GetType().GetProperties();

      string file = GetObjectTypeFile(obj);

      // Deserialize JSON in GeneralSettings.json file
      definedSettings = JsonHelper.ParseJsonFromFile(file);

      foreach (var prop in objProps)
      {
        // check if prop.Name exists in definedSettings' index
        // if it does, update its value in GeneralSettings
        if (definedSettings != null)
        {
          if (definedSettings[prop.Name] != null)
          {
            // Set prop to value defined in settings file
            var newVal = definedSettings.GetValue(prop.Name);

            // Define settings in different ways depending on their type
            if (prop.PropertyType == typeof(List<string>))
            {
              // Create new temporary list
              List<string> values = new List<string>();

              // Add all newValues from json array to list
              foreach (var nv in newVal)
              {
                values.Add(nv.ToString());
              }

              // Set prop to values list
              prop.SetValue(obj, values);
            }
            else if (prop.PropertyType == typeof(string))
            {
              // If prop is a string, just simply convert newVal to string
              prop.SetValue(obj, newVal.ToString());
            }
            else
            {
              throw new Exception("Defining settings of unknown type.");
            }
          }
        }
      }

      // // Serialize json back to file in case of missing rules
      // JsonHelper.SerializeJsonToFile(file, obj);
    }

    /// <summary>
    /// Get variables from obj, serialize them and (re)write them to json file related to obj
    /// </summary>
    /// <param name="obj">object with settings defined</param>
    public void UpdateSettingsFile(object obj)
    {
      string file = GetObjectTypeFile(obj);

      // Serialize json to file
      JsonHelper.SerializeJsonToFile(file, obj);
    }
  }
}
