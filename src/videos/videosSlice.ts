import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideosState, Video } from "./types";

const videosSlice = createSlice({
  name: "videos",
  initialState: { videos: [] } as VideosState,
  reducers: {
    addVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos.push(...action.payload);
    }
  }
});

export const { addVideos } = videosSlice.actions;

export default videosSlice.reducer;
