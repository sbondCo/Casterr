/**
 * All initial states / constants for use around app.
 * Initial states defined here so we can reuse them as defaults.
 */

import path from "path";
import Paths from "@/libs/helpers/paths";
import type { Settings } from "@/settings/types";

// App settings, not user editable.
export const APP_SETTINGS = {
  supportedRecordingFormats: ["mp4", "mkv"]
};

export const DEFAULT_SETTINGS = {
  general: {
    rcStatusAlsoStopStart: true,
    rcStatusDblClkToRecord: false,
    deleteVideoConfirmationDisabled: false,
    deleteVideosFromDisk: false,
    videoEditorVolume: 0.8
  },
  recording: {
    thumbSaveFolder: path.join(Paths.mainFolderPath, "Thumbs"),
    videoSaveFolder: path.join(Paths.homeFolderPath, "Videos", "Casterr"),
    videoSaveName: "%d.%m.%Y - %H.%i.%s",
    videoDevice: "Default",
    monitorToRecord: {
      id: "primary",
      name: "Primary Monitor"
    },
    fps: 60,
    resolution: "1080p",
    format: "mp4",
    zeroLatency: true,
    ultraFast: true,
    audioDevicesToRecord: [] as string[],
    seperateAudioTracks: false,
    hardwareEncoding: false
  },
  key: {
    startStopRecording: "F9",
    startStopRecordingRegion: "F10",
    addBookmark: "F2"
  }
} as Settings;
