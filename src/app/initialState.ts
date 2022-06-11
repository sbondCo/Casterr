/**
 * All initial states.
 * Defined here so we can reuse them as defaults.
 */

import PathHelper from "@/libs/helpers/pathHelper";
import { Path } from "@/libs/node";
import { Settings } from "@/settings/types";

export const DEFAULT_SETTINGS = {
  app: {
    pages: ["Videos", "Settings"],
    supportedRecordingFormats: ["mp4", "mkv"]
  },
  general: {
    startupPage: "Videos",
    rcStatusAlsoStopStart: true,
    rcStatusDblClkToRecord: false,
    deleteVideoConfirmationDisabled: false,
    deleteVideosFromDisk: false
  },
  recording: {
    thumbSaveFolder: Path.join(PathHelper.mainFolderPath, "Thumbs"),
    videoSaveFolder: Path.join(PathHelper.homeFolderPath, "Videos", "Casterr"),
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
