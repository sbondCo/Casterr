import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RecordingState {
  isRecording: boolean;

  /**
   * Recording time elapsed in seconds.
   */
  timeElapsed: number;
}

const recorderSlice = createSlice({
  name: "recorder",
  initialState: { isRecording: false, timeElapsed: 0 } as RecordingState,
  reducers: {
    isRecording(state, action: PayloadAction<boolean>) {
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
    }
  }
});

export const { isRecording, incrementElapsed, resetElapsed } = recorderSlice.actions;

export default recorderSlice.reducer;
