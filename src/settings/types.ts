import type { APP_SETTINGS } from "@/app/constants";

export type ResolutionScale = typeof APP_SETTINGS.prefilledResolutions[number] | "disabled" | "custom";

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
  /**
   * When set, video output will be scaled to this resolution.
   */
  resolutionScale: ResolutionScale;
  resolutionCustom: { width: number; height: number };
  /**
   * If a resolution is set to scale to, should we keep the aspect ratio of original video?
   */
  resolutionKeepAspectRatio: boolean;
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
   * If we should offload encoding to GPU.
   */
  hardwareEncoding: boolean;

  /**
   * Saved custom region of screen to record.
   * If a user only records a certain space of
   * their screen always, this will help by saving that region.
   */
  regionToRecord: { x: number; y: number; width: number; height: number };
}

export interface KeyBindingSettings {
  startStopRecording: string;
  startStopRecordingRegion: string;
  /**
   * Start/stop recording the `regionToRecord` setting if set.
   */
  startStopRecordingSavedRegion: string;
  addBookmark: string;
}

export interface MonitorToRecord {
  id: string;
  name: string;
}
