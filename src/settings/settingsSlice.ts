import { DEFAULT_SETTINGS } from "@/app/constants";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResolutionScale, MonitorToRecord } from "./types";

const settingsSlice = createSlice({
  name: "settings",
  initialState: DEFAULT_SETTINGS,
  reducers: {
    //
    // General Settings
    //
    setRcStatusAlsoStopStart(state, action: PayloadAction<boolean>) {
      state.general.rcStatusAlsoStopStart = action.payload;
    },
    setRcStatusDblClkToRecord(state, action: PayloadAction<boolean>) {
      state.general.rcStatusDblClkToRecord = action.payload;
    },
    setDeleteVideoConfirmationDisabled(state, action: PayloadAction<boolean>) {
      state.general.deleteVideoConfirmationDisabled = action.payload;
    },
    setDeleteVideosFromDisk(state, action: PayloadAction<boolean>) {
      state.general.deleteVideosFromDisk = action.payload;
    },
    setVideoEditorVolume(state, action: PayloadAction<number>) {
      state.general.videoEditorVolume = action.payload;
    },

    //
    // Recording Settings
    //
    setThumbSaveFolder(state, action: PayloadAction<string>) {
      state.recording.thumbSaveFolder = action.payload;
    },
    setVideoSaveFolder(state, action: PayloadAction<string>) {
      state.recording.videoSaveFolder = action.payload;
    },
    setVideoSaveName(state, action: PayloadAction<string>) {
      state.recording.videoSaveName = action.payload;
    },
    setVideoDevice(state, action: PayloadAction<string>) {
      state.recording.videoDevice = action.payload;
    },
    setMonitorToRecord(state, action: PayloadAction<MonitorToRecord>) {
      state.recording.monitorToRecord = action.payload;
    },
    setFps(state, action: PayloadAction<number>) {
      state.recording.fps = action.payload;
    },
    setResolution(state, action: PayloadAction<ResolutionScale>) {
      state.recording.resolutionScale = action.payload;
    },
    setResolutionCustom(state, action: PayloadAction<{ width?: number; height?: number }>) {
      if (action.payload.width) state.recording.resolutionCustom.width = action.payload.width;
      if (action.payload.height) state.recording.resolutionCustom.height = action.payload.height;
    },
    setResolutionKeepAspectRatio(state, action: PayloadAction<boolean>) {
      state.recording.resolutionKeepAspectRatio = action.payload;
    },
    setFormat(state, action: PayloadAction<string>) {
      state.recording.format = action.payload;
    },
    setZeroLatency(state, action: PayloadAction<boolean>) {
      state.recording.zeroLatency = action.payload;
    },
    setUltraFast(state, action: PayloadAction<boolean>) {
      state.recording.ultraFast = action.payload;
    },
    toggleAudioDeviceToRecord(state, action: PayloadAction<{ id: string; isEnabled: boolean }>) {
      if (action.payload.isEnabled) {
        state.recording.audioDevicesToRecord = [...state.recording.audioDevicesToRecord, action.payload.id];
      } else {
        state.recording.audioDevicesToRecord = state.recording.audioDevicesToRecord.filter(
          (id) => id !== action.payload.id
        );
      }
    },
    removeAudioDevicesToRecord(state, action: PayloadAction<string[]>) {
      state.recording.audioDevicesToRecord = state.recording.audioDevicesToRecord.filter(
        (id) => !action.payload.includes(id)
      );
    },
    setSeperateAudioTracks(state, action: PayloadAction<boolean>) {
      state.recording.seperateAudioTracks = action.payload;
    },
    setHardwareEncoding(state, action: PayloadAction<boolean>) {
      state.recording.hardwareEncoding = action.payload;
    },
    setRegionToRecord(state, action: PayloadAction<{ x?: number; y?: number; width?: number; height?: number }>) {
      if (action.payload.x) state.recording.regionToRecord.x = action.payload.x;
      if (action.payload.y) state.recording.regionToRecord.y = action.payload.y;
      if (action.payload.width) state.recording.regionToRecord.width = action.payload.width;
      if (action.payload.height) state.recording.regionToRecord.height = action.payload.height;
    },

    //
    // Key Binding Settings
    //
    setStartStopRecording(state, action: PayloadAction<string>) {
      state.key.startStopRecording = action.payload;
    },
    setStartStopRecordingRegion(state, action: PayloadAction<string>) {
      state.key.startStopRecordingRegion = action.payload;
    },
    setStartStopRecordingSavedRegion(state, action: PayloadAction<string>) {
      state.key.startStopRecordingSavedRegion = action.payload;
    },
    setAddBookmark(state, action: PayloadAction<string>) {
      state.key.addBookmark = action.payload;
    }
  }
});

export const {
  setRcStatusAlsoStopStart,
  setRcStatusDblClkToRecord,
  setDeleteVideoConfirmationDisabled,
  setDeleteVideosFromDisk,
  setVideoEditorVolume,

  setThumbSaveFolder,
  setVideoSaveFolder,
  setVideoSaveName,
  setVideoDevice,
  setMonitorToRecord,
  setFps,
  setResolution,
  setResolutionCustom,
  setResolutionKeepAspectRatio,
  setFormat,
  setZeroLatency,
  setUltraFast,
  toggleAudioDeviceToRecord,
  removeAudioDevicesToRecord,
  setSeperateAudioTracks,
  setHardwareEncoding,
  setRegionToRecord,

  setStartStopRecording,
  setStartStopRecordingRegion,
  setStartStopRecordingSavedRegion,
  setAddBookmark
} = settingsSlice.actions;

export default settingsSlice.reducer;
