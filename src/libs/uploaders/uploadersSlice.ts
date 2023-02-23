import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Uploaders, YouTubeUploader, YoutubeUploaderRefresh } from "./types";

const uploadersSlice = createSlice({
  name: "uploaders",
  initialState: {} as Uploaders,
  reducers: {
    youtubeConnected(state, action: PayloadAction<YouTubeUploader>) {
      state.youtube = action.payload;
    },
    youtubeTokenRefreshed(state, action: PayloadAction<YoutubeUploaderRefresh>) {
      if (state.youtube) {
        state.youtube.access_token = action.payload.access_token;
        state.youtube.expires = action.payload.expires;
        state.youtube.scope = action.payload.scope;
      }
    },
    youtubeUserFetched(state, action: PayloadAction<string>) {
      if (action.payload && state.youtube) state.youtube.username = action.payload;
    },
    youtubeDisconnected(state) {
      delete state.youtube;
    }
  }
});

export const { youtubeConnected, youtubeTokenRefreshed, youtubeUserFetched, youtubeDisconnected } =
  uploadersSlice.actions;

export default uploadersSlice.reducer;
