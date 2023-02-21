export interface Settings {
  general: GeneralSettings;
  recording: RecordingSettings;
  key: KeyBindingSettings;
}

export interface GeneralSettings {
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

  /**
   * Video editor volume.
   */
  videoEditorVolume: number;
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

  /**
   * If we should record the past or not.
   * In seconds of how long we should allow recording of the past.
   * 0 = disabled.
   */
  recordThePast: number;
}

export interface KeyBindingSettings {
  startStopRecording: string;
}

export interface MonitorToRecord {
  id: string;
  name: string;
}
