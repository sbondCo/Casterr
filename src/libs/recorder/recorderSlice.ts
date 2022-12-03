import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      // TODO Depending on new state, start/stop a interval incrementing elapsed time
      state.isRecording = action.payload;
    },
    /**
     * Increment recording timeElapsed by 1 second.
     */
    incrementElapsed(state) {
      state.timeElapsed += 1;
    }
  }
});

export const { isRecording, incrementElapsed } = recorderSlice.actions;

export default recorderSlice.reducer;
