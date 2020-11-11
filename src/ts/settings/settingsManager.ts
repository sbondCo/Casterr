import PathHelper from "./../helpers/pathHelper";
const fs = require("fs");
const path = require("path");

export namespace Settings {
  export class Manager {
    public static writeSettings() {
      fs.writeFile(path.join(PathHelper.mainFolderPath(), "settings", "GeneralSettings.json"), "hi", (err: any) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    }
  
    public static getSettings(which: string) {
      let objToCastTo: object;
      
      // Set objToCastTo var depending on `which` setting is requested.
      // If not understood throw an error
      switch (which) {
        case "General":
          objToCastTo = Settings.GeneralSettings;
          break;
        case "Recording":
          objToCastTo = Settings.RecordingSettings;
          break;
        case "KeyBinding":
          objToCastTo = Settings.KeyBindingSettings;
          break;
        default:
          throw new Error(`Requested settings (${which}) do not exist.`);
          break;
      }

      fs.readFile(path.join(PathHelper.settingsFolderPath, `${which}Settings.json`), (err: any, data: string) => {
        if (err) throw err;

        // Cast json from setting file to correct object
        Object.assign(objToCastTo, JSON.parse(data.toString()));
      });
    }
  }

  /**
   * Application wide settings that can't be changed
   */
  export class App {
    // Pages in application
    public static get pages() {
      return ["Recordings", "Uploads", "Settings", "Profile"];
    }

    // Settings files
    public static get settingsFiles() {
      return ["General", "Recording", "KeyBinding"];
    }
  }
  
  /**
   * General Settings
   */
  export class GeneralSettings {
    private static _startupPage: string = "Recordings";

    /**
     * startupPage
     */
    public static get startupPage() {
      return this._startupPage;
    }

    public static set startupPage(page) {
      this._startupPage = page;
    }
  }

  /**
   * Recording Settings
   */
  export class RecordingSettings {
    private static _thumbSaveFolder: string = path.join(PathHelper.mainFolderPath, "Thumbs");
    private static _videoSaveFolder: string = path.join(PathHelper.mainFolderPath, "Videos");
    private static _videoSaveName: string = "%d.%m.%Y - %H.%i.%s";
    private static _videoDevice: string = "Default";
    private static _fps: string = "60";
    private static _resolution: string = "In-Game";
    private static _format: string = "mp4";
    private static _zeroLatency: boolean = true;
    private static _ultraFast: boolean = true;
    private static _audioDevicesToRecord: Array<string>;
    private static _seperateAudioTracks: boolean = false;

    /**
     * thumbSaveFolder
     */
    public static get thumbSaveFolder() {
      return this._thumbSaveFolder;
    }

    public static set thumbSaveFolder(folder) {
      this._thumbSaveFolder = folder;
    }

    /**
     * videoSaveFolder
     */
    public static get videoSaveFolder() {
      return this._videoSaveFolder;
    }

    public static set videoSaveFolder(folder) {
      this._videoSaveFolder = folder;
    }

    /**
     * videoSaveName
     */
    public static get videoSaveName() {
      return this._videoSaveName;
    }

    public static set videoSaveName(name) {
      this._videoSaveName = name;
    }

    /**
     * videoDevice
     */
    public static get videoDevice() {
      return this._videoDevice;
    }

    public static set videoDevice(device) {
      this._videoDevice = device;
    }

    /**
     * fps
     */
    public static get fps() {
      return this._fps;
    }

    public static set fps(fps) {
      this._fps = fps;
    }

    /**
     * resolution
     */
    public static get resolution() {
      return this._resolution;
    }

    public static set resolution(res) {
      this._resolution = res;
    }

    /**
     * format
     */
    public static get format() {
      return this._format;
    }

    public static set format(format) {
      this._format = format;
    }

    /**
     * zeroLatency
     */
    public static get zeroLatency() {
      return this._zeroLatency;
    }

    public static set zeroLatency(zeroLatency) {
      this._zeroLatency = zeroLatency;
    }

    /**
     * ultraFast
     */
    public static get ultraFast() {
      return this._ultraFast;
    }

    public static set ultraFast(ultraFast) {
      this._ultraFast = ultraFast;
    }
    
    /**
     * audioDevicesToRecord
     */
    public static get audioDevicesToRecord() {
      return this._audioDevicesToRecord;
    }

    public static set audioDevicesToRecord(devices) {
      this._audioDevicesToRecord = devices;
    }

    /**
     * seperateAudioTracks
     */
    public static get seperateAudioTracks() {
      return this._seperateAudioTracks;
    }

    public static set seperateAudioTracks(seperateTracks) {
      this._seperateAudioTracks = seperateTracks;
    }
  }

  /**
   * KeyBinding Settings
   */
  export class KeyBindingSettings {
    private static _startStopRecording: string = "CommandOrControl+X";

    /**
     * startStopRecording
     */
    public static get startStopRecording() {
      return this._startStopRecording;
    }

    public static set startStopRecording(key) {
      this._startStopRecording = key;
    }
  }
}
