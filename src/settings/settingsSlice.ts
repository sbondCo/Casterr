import { DEFAULT_SETTINGS } from "@/app/constants";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type MonitorToRecord } from "./types";

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
    },
    setStartStopRecordingRegion(state, action: PayloadAction<string>) {
      state.key.startStopRecordingRegion = action.payload;
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
  setFormat,
  setZeroLatency,
  setUltraFast,
  toggleAudioDeviceToRecord,
  setSeperateAudioTracks,

  setStartStopRecording,
  setStartStopRecordingRegion,
  setAddBookmark
} = settingsSlice.actions;

export default settingsSlice.reducer;
