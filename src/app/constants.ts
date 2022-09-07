/**
 * All initial states / constants for use around app.
 * Initial states defined here so we can reuse them as defaults.
 */

import path from "path";
import PathHelper from "@/libs/helpers/pathHelper";
import { Settings } from "@/settings/types";

// App settings, not user editable.
export const APP_SETTINGS = {
  pages: ["Videos", "Settings"],
  supportedRecordingFormats: ["mp4", "mkv"]
};

export const DEFAULT_SETTINGS = {
  general: {
    startupPage: "Videos",
    rcStatusAlsoStopStart: true,
    rcStatusDblClkToRecord: false,
    deleteVideoConfirmationDisabled: false,
    deleteVideosFromDisk: false
  },
  recording: {
    thumbSaveFolder: path.join(PathHelper.mainFolderPath, "Thumbs"),
    videoSaveFolder: path.join(PathHelper.homeFolderPath, "Videos", "Casterr"),
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
    audioDevicesToRecord: new Array(),
    seperateAudioTracks: false
  }
} as Settings;
