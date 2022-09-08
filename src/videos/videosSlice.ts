import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideosState, Video } from "./types";

const videosSlice = createSlice({
  name: "videos",
  initialState: { recordings: [], clips: [] } as VideosState,
  reducers: {
    addVideo: (state, action: PayloadAction<Video[]>) => {
      // state.videos.push(...action.payload);
    }
  }
});

export const { addVideo } = videosSlice.actions;

export default videosSlice.reducer;
