import PathHelper from "./helpers/pathHelper";
// import { AudioDevice } from "./recorder/deviceManager";
// import * as fs from "fs";
// import * as path from "path";

// export enum SettingsFiles {
//   General = "GeneralSettings.json",
//   Recording = "RecordingSettings.json",
//   KeyBinding = "KeyBindingSettings.json"
// }

// export default class SettingsManager {
//   /**
//    * Write settings to file
//    */
//   public static writeSettings(which: SettingsFiles) {
//     const json: any = {};

//     // Read all entries in correct settings object and make a json object to write
//     Object.entries(this.getObjectFromName(which)).forEach((pair) => {
//       // Remove '_' from pair[0]/key then set it to pair[1]/value
//       json[pair[0].substring(1)] = pair[1];
//     });

//     // Write settings in objects to correct file, format json with 2 spaces
//     fs.writeFile(PathHelper.getFile(which), JSON.stringify(json, null, 2), (err: any) => {
//       if (err) throw err;
//     });
//   }

//   /**
//    * Get settings from file
//    * @param which Which settings to get
//    */
//   public static getSettings(which: SettingsFiles) {
//     return new Promise((resolve, reject) => {
//       // Read settings file
//       fs.readFile(PathHelper.getFile(which), "utf8", (err: any, data: string) => {
//         if (err) reject(err);

//         // If file isn't empty, cast json from setting file to correct object
//         if (data != "") {
//           const dataJson = JSON.parse(data);
//           const settingsKeys = Object.keys(this.getObjectFromName(which));

//           // Delete items in `dataJson` that aren't present
//           // in the current settings class being processed
//           Object.keys(dataJson).forEach((k) => {
//             if (!settingsKeys.includes(`_${k}`)) {
//               delete dataJson[k];
//             }
//           });

//           // Assign dataJson to settings class
//           Object.assign(this.getObjectFromName(which), dataJson);
//         }

//         // Write settings back to file, incase of missing rules
//         this.writeSettings(which);

//         resolve(null);
//       });
//     });
//   }

//   /**
//    * Get settings object from name as a string
//    * @param name Name of object wanted
//    */
//   private static getObjectFromName(name: SettingsFiles) {
//     // Switch over name to get correct object. If unrecognized name set, throw an err
//     switch (name) {
//       case SettingsFiles.General:
//         return GeneralSettings;
//         break;
//       case SettingsFiles.Recording:
//         return RecordingSettings;
//         break;
//       case SettingsFiles.KeyBinding:
//         return KeyBindingSettings;
//         break;
//       default:
//         throw new Error(`Requested settings (${name}) do not exist.`);
//         break;
//     }
//   }
// }

// /**
//  * Application wide settings that can't be changed
//  */
// export class AppSettings {
//   // Pages in application
//   public static get pages() {
//     return ["Videos", "Settings"];
//   }

//   // Supported recording formats
//   public static get supportedRecordingFormats() {
//     return ["mp4", "mkv"];
//   }
// }

// /**
//  * General Settings
//  */
// export class GeneralSettings {
//   private static _startupPage: string = "Videos";
//   private static _recordingStatusAlsoStopStartRecording: boolean = true;
//   private static _recordingStatusDblClkToRecord: boolean = false;
//   private static _deleteVideoConfirmationDisabled: boolean = false;
//   private static _deleteVideosFromDiskByDefault: boolean = false;

//   /**
//    * startupPage
//    */
//   public static get startupPage() {
//     return this._startupPage;
//   }

//   public static set startupPage(page) {
//     this._startupPage = page;
//   }

//   /**
//    * recordingStatusAlsoStopStartRecording
//    * If recording status indicator should also act as a button to start/stop recording.
//    */
//   public static get recordingStatusAlsoStopStartRecording() {
//     return this._recordingStatusAlsoStopStartRecording;
//   }

//   public static set recordingStatusAlsoStopStartRecording(should) {
//     this._recordingStatusAlsoStopStartRecording = should;
//   }

//   /**
//    * recordingStatusDblClkToRecord
//    * If user should have to double click or not to start/stop recording with status indicator.
//    */
//   public static get recordingStatusDblClkToRecord() {
//     return this._recordingStatusDblClkToRecord;
//   }

//   public static set recordingStatusDblClkToRecord(should) {
//     this._recordingStatusDblClkToRecord = should;
//   }

//   /**
//    * If the delete video confirmation popup should be disabled.
//    */
//   public static get deleteVideoConfirmationDisabled() {
//     return this._deleteVideoConfirmationDisabled;
//   }

//   public static set deleteVideoConfirmationDisabled(should) {
//     this._deleteVideoConfirmationDisabled = should;
//   }

//   /**
//    * If the 'remove from disk' TickBox should be set to true by default.
//    * If the popup is disabled, this will still cause videos to be removed from disk by default.
//    */
//   public static get deleteVideosFromDiskByDefault() {
//     return this._deleteVideosFromDiskByDefault;
//   }

//   public static set deleteVideosFromDiskByDefault(should) {
//     this._deleteVideosFromDiskByDefault = should;
//   }
// }

// /**
//  * Recording Settings
//  */
// export class RecordingSettings {
//   private static _thumbSaveFolder: string = path.join(PathHelper.mainFolderPath, "Thumbs");
//   private static _videoSaveFolder: string = path.join(PathHelper.homeFolderPath, "Videos", "Casterr");
//   private static _videoSaveName: string = "%d.%m.%Y - %H.%i.%s";
//   private static _videoDevice: string = "Default";
//   private static _monitorToRecord = {
//     id: "primary",
//     name: "Primary Monitor"
//   };
//   private static _fps: string = "60";
//   private static _resolution: string = "1080p";
//   private static _format: string = "mp4";
//   private static _zeroLatency: boolean = true;
//   private static _ultraFast: boolean = true;
//   private static _audioDevicesToRecord: Array<AudioDevice> = [];
//   private static _seperateAudioTracks: boolean = false;

//   /**
//    * thumbSaveFolder
//    */
//   public static get thumbSaveFolder() {
//     return this._thumbSaveFolder;
//   }

//   public static set thumbSaveFolder(folder) {
//     this._thumbSaveFolder = folder;
//   }

//   /**
//    * videoSaveFolder
//    */
//   public static get videoSaveFolder() {
//     return this._videoSaveFolder;
//   }

//   public static set videoSaveFolder(folder) {
//     this._videoSaveFolder = folder;
//   }

//   /**
//    * videoSaveName
//    */
//   public static get videoSaveName() {
//     return this._videoSaveName;
//   }

//   public static set videoSaveName(name) {
//     this._videoSaveName = name;
//   }

//   /**
//    * videoDevice
//    */
//   public static get videoDevice() {
//     return this._videoDevice;
//   }

//   public static set videoDevice(device) {
//     this._videoDevice = device;
//   }

//   /**
//    * monitorToRecord
//    */
//   public static get monitorToRecord() {
//     return this._monitorToRecord;
//   }

//   public static set monitorToRecord(monitor) {
//     this._monitorToRecord = monitor;
//   }

//   /**
//    * fps
//    */
//   public static get fps() {
//     return this._fps;
//   }

//   public static set fps(fps) {
//     this._fps = fps;
//   }

//   /**
//    * resolution
//    */
//   public static get resolution() {
//     return this._resolution;
//   }

//   public static set resolution(res) {
//     this._resolution = res;
//   }

//   /**
//    * format
//    */
//   public static get format() {
//     // If format equals a supported format, return it
//     // If it doesn't return the default of `mp4`
//     if (this._format.equalsAnyOf(AppSettings.supportedRecordingFormats)) return this._format;
//     else return "mp4";
//   }

//   public static set format(format) {
//     this._format = format;
//   }

//   /**
//    * zeroLatency
//    */
//   public static get zeroLatency() {
//     return this._zeroLatency;
//   }

//   public static set zeroLatency(zeroLatency) {
//     this._zeroLatency = zeroLatency;
//   }

//   /**
//    * ultraFast
//    */
//   public static get ultraFast() {
//     return this._ultraFast;
//   }

//   public static set ultraFast(ultraFast) {
//     this._ultraFast = ultraFast;
//   }

//   /**
//    * audioDevicesToRecord
//    */
//   public static get audioDevicesToRecord() {
//     return this._audioDevicesToRecord;
//   }

//   public static set audioDevicesToRecord(devices) {
//     this._audioDevicesToRecord = devices;
//   }

//   /**
//    * seperateAudioTracks
//    */
//   public static get seperateAudioTracks() {
//     return this._seperateAudioTracks;
//   }

//   public static set seperateAudioTracks(seperateTracks) {
//     this._seperateAudioTracks = seperateTracks;
//   }
// }

// /**
//  * KeyBinding Settings
//  */
// export class KeyBindingSettings {
//   private static _startStopRecording: string = "CommandOrControl+X";

//   /**
//    * startStopRecording
//    */
//   public static get startStopRecording() {
//     return this._startStopRecording;
//   }

//   public static set startStopRecording(key) {
//     this._startStopRecording = key;
//   }
// }
