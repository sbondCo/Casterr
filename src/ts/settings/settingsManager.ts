import PathHelper from "./../helpers/pathHelper";
const fs = require("fs");
const path = require("path");

export class SettingsManager {
  public static writeSettings() {
    fs.writeFile(path.join(PathHelper.mainFolderPath(), "settings", "GeneralSettings.json"), "hi", (err: any) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  }

  public static getSettings() {
    fs.readFile(path.join(PathHelper.mainFolderPath(), "settings", "GeneralSettings.json"), (err: any, data: string) => {
      // Cast json from setting file to correct object
      Object.assign(Settings.GeneralSettings, JSON.parse(data.toString()));
    });
  }
}

export namespace Settings {
  export class GeneralSettings {
    private static _startupPage: string = "Recordings";

    public static get startupPage() {
      return this._startupPage;
    }

    public static set startupPage(page) {
      this._startupPage = page;
    }
  }
}
