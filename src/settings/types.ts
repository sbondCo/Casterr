import PathHelper from "@/libs/helpers/pathHelper";
import { AudioDevice } from "@/libs/recorder/deviceManager";
import path from "path";

export interface Settings {
  app: AppSettings;
  general: GeneralSettings;
  recording: RecordingSettings;
  key: KeyBindingSettings;
}

export interface AppSettings {
  pages: string[];
  supportedRecordingFormats: string[];
}

export class GeneralSettings {
  /**
   * Page to load on startup of Casterr.
   */
  startupPage: Page = "Videos";

  /**
   * If the recording status indicator should
   * start/stop recording when clicked.
   */
  rcStatusAlsoStopStart: boolean = true;

  /**
   * If recording status indicator should need to be
   * double clicked or single clicked to start/stop record.
   */
  rcStatusDblClkToRecord: boolean = false;

  /**
   * If when deleting a video a confirmation box should show.
   */
  deleteVideoConfirmationDisabled: boolean = false;

  /**
   * If we should also delete the video from disk when deleted
   * in Casterr.
   */
  deleteVideosFromDisk: boolean = false;
}

export interface RecordingSettings {
  thumbSaveFolder: string;
  videoSaveFolder: string;
  videoSaveName: string;
  videoDevice: string;
  monitorToRecord: MonitorToRecord;
  fps: number;
  resolution: string;
  format: string;
  zeroLatency: boolean;
  ultraFast: boolean;
  audioDevicesToRecord: Array<AudioDevice>;

  /**
   * If audio devices should be recorded on
   * different audio tracks.
   */
  seperateAudioTracks: boolean;
}

/**
 * Not yet implemented.
 */
export interface KeyBindingSettings {
  startStopRecording: string;
}

export type Page = "Videos" | "Settings";

export type MonitorToRecord = { id: string; name: string };
