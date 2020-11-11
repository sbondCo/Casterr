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
      // Check if requested settings exist by matching it to items in settingsFiles array
      if (!Settings.App.settingsFiles.includes(which)) {
        throw new Error(`Requested settings (${which}) do not exist.`);
      }

      fs.readFile(path.join(PathHelper.mainFolderPath(), "settings", `RecordingSettings.json`), (err: any, data: string) => {
        if (err) throw err;

        // Cast json from setting file to correct object
        Object.assign(Settings.RecordingSettings, JSON.parse(data.toString()));

        console.log(Settings.RecordingSettings.videoSaveName);
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
    private static _thumbSaveFolder: string;
    private static _videoSaveFolder: string;
    private static _videoSaveName: string;
    private static _videoDevice: string;
    private static _fps: string;
    private static _resolution: string;
    private static _format: string;
    private static _zeroLatency: string;
    private static _ultraFast: string;
    private static _audioDevicesToRecord: Array<string>;
    private static _seperateAudioTracks: string;

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
}
