export interface Settings {
  general: GeneralSettings;
  recording: RecordingSettings;
  key: KeyBindingSettings;
}

export interface GeneralSettings {
  /**
   * Page to load on startup of Casterr.
   */
  startupPage: Page;

  /**
   * If the recording status indicator should
   * start/stop recording when clicked.
   */
  rcStatusAlsoStopStart: boolean;

  /**
   * If recording status indicator should need to be
   * double clicked or single clicked to start/stop record.
   */
  rcStatusDblClkToRecord: boolean;

  /**
   * If when deleting a video a confirmation box should show.
   */
  deleteVideoConfirmationDisabled: boolean;

  /**
   * If we should also delete the video from disk when deleted
   * in Casterr.
   */
  deleteVideosFromDisk: boolean;
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
  audioDevicesToRecord: string[];

  /**
   * If audio devices should be recorded on
   * different audio tracks.
   */
  seperateAudioTracks: boolean;
}

export interface KeyBindingSettings {
  startStopRecording: string;
}

export type Page = "Videos" | "Settings";

export interface MonitorToRecord {
  id: string;
  name: string;
}
