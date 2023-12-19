import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * 0: Not recording - idle
 * 1: Recording
 * 2: Loading/downloading tools
 */
type RecordingStatus = 0 | 1 | 2;

interface RecordingState {
  recordingStatus: RecordingStatus;

  /**
   * Recording time elapsed in seconds.
   */
  timeElapsed: number;

  /**
   * Bookmarks added whilst recording,
   * added to final video object before adding
   * to appropriate video json file on stop.
   */
  bookmarks: number[];
}

const recorderSlice = createSlice({
  name: "recorder",
  initialState: { recordingStatus: 0, timeElapsed: 0, bookmarks: [] } as RecordingState,
  reducers: {
    setRecordingStatus(state, action: PayloadAction<RecordingStatus>) {
      // Reset bookmarks when starting new recording.
      if (action.payload === 1) {
        state.bookmarks = [];
      }
      state.recordingStatus = action.payload;
    },
    /**
     * Increment recording timeElapsed by 1 second.
     */
    incrementElapsed(state) {
      state.timeElapsed += 1;
    },
    /**
     * Reset recording timeElapsed back to 0.
     */
    resetElapsed(state) {
      state.timeElapsed = 0;
    },
    /**
     * Add bookmark to the currently recording video (at current `timeElapsed`).
     */
    addBookmarkToRecording(state) {
      state.bookmarks.push(state.timeElapsed);
    }
  }
});

export const { setRecordingStatus, incrementElapsed, resetElapsed, addBookmarkToRecording } = recorderSlice.actions;

export default recorderSlice.reducer;
