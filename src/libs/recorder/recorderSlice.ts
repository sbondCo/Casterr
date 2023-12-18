import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RecordingState {
  isRecording: boolean;

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
  initialState: { isRecording: false, timeElapsed: 0, bookmarks: [] } as RecordingState,
  reducers: {
    isRecording(state, action: PayloadAction<boolean>) {
      // Reset bookmarks when starting new recording.
      if (action.payload) {
        state.bookmarks = [];
      }
      state.isRecording = action.payload;
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

export const { isRecording, incrementElapsed, resetElapsed, addBookmarkToRecording } = recorderSlice.actions;

export default recorderSlice.reducer;
