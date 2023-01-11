import { DEFAULT_SETTINGS } from "@/app/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Page, MonitorToRecord } from "./types";

const settingsSlice = createSlice({
  name: "settings",
  initialState: DEFAULT_SETTINGS,
  reducers: {
    //
    // General Settings
    //
    setStartupPage(state, action: PayloadAction<Page>) {
      state.general.startupPage = action.payload;
    },
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
    setResolution(state, action: PayloadAction<string>) {
      state.recording.resolution = action.payload;
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
    setSeperateAudioTracks(state, action: PayloadAction<boolean>) {
      state.recording.seperateAudioTracks = action.payload;
    },

    //
    // Key Binding Settings
    //
    setStartStopRecording(state, action: PayloadAction<string>) {
      state.key.startStopRecording = action.payload;
    }
  }
});

export const {
  setStartupPage,
  setRcStatusAlsoStopStart,
  setRcStatusDblClkToRecord,
  setDeleteVideoConfirmationDisabled,
  setDeleteVideosFromDisk,

  setThumbSaveFolder,
  setVideoSaveFolder,
  setVideoSaveName,
  setVideoDevice,
  setMonitorToRecord,
  setFps,
  setResolution,
  setFormat,
  setZeroLatency,
  setUltraFast,
  toggleAudioDeviceToRecord,
  setSeperateAudioTracks,

  setStartStopRecording
} = settingsSlice.actions;

export default settingsSlice.reducer;
