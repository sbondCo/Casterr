import { DEFAULT_SETTINGS } from "@/app/constants";
import { AudioDevice } from "@/libs/recorder/deviceManager";
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
    addAudioDevicesToRecord(state, action: PayloadAction<AudioDevice>) {
      state.recording.audioDevicesToRecord.push(action.payload);
    },
    delAudioDevicesToRecord(state, action: PayloadAction<AudioDevice>) {
      state.recording.audioDevicesToRecord.filter((a) => a.id !== action.payload.id);
    },
    setSeperateAudioTracks(state, action: PayloadAction<boolean>) {
      state.recording.seperateAudioTracks = action.payload;
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
  addAudioDevicesToRecord,
  delAudioDevicesToRecord,
  setSeperateAudioTracks
} = settingsSlice.actions;

export default settingsSlice.reducer;
