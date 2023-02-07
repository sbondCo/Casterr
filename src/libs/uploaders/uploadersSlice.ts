import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Uploaders, YouTubeUploader } from "./types";

const uploadersSlice = createSlice({
  name: "uploaders",
  initialState: {} as Uploaders,
  reducers: {
    youtubeConnected(state, action: PayloadAction<YouTubeUploader>) {
      state.youtube = action.payload;
    },
    youtubeUserFetched(state, action: PayloadAction<string>) {
      if (action.payload && state.youtube) state.youtube.username = action.payload;
    },
    youtubeDisconnected(state) {
      delete state.youtube;
    }
  }
});

export const { youtubeConnected, youtubeUserFetched, youtubeDisconnected } = uploadersSlice.actions;

export default uploadersSlice.reducer;
