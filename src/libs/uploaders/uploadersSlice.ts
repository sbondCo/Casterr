import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Uploaders, YouTubeUploader } from "./types";

const uploadersSlice = createSlice({
  name: "uploaders",
  initialState: {} as Uploaders,
  reducers: {
    youtubeConnected(state, action: PayloadAction<YouTubeUploader>) {
      state.youtube = action.payload;
    }
  }
});

export const { youtubeConnected } = uploadersSlice.actions;

export default uploadersSlice.reducer;
