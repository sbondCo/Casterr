import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideosState, Video } from "./types";

const videosSlice = createSlice({
  name: "videos",
  initialState: { recordings: [], clips: [] } as VideosState,
  reducers: {
    videoAdded: (state, action: PayloadAction<Video>) => {
      if (action.payload.isClip) {
        state.clips.push(action.payload);
      } else {
        state.recordings.push(action.payload);
      }
    },
    /**
     *
     * @param action.payload Path to video removed.
     */
    videoRemoved: (state, action: PayloadAction<Video>) => {
      if (action.payload.isClip) {
        state.clips = state.clips.filter((v) => v.videoPath !== action.payload.videoPath);
      } else {
        state.recordings = state.recordings.filter((v) => v.videoPath !== action.payload.videoPath);
      }
    },
    videoRenamed: (state, action: PayloadAction<{ videoPath: string; newName: string }>) => {
      state.recordings = state.recordings.map((v) => {
        if (v.videoPath === action.payload.videoPath) {
          v.name = action.payload.newName;
        }
        return v;
      });
    }
  }
});

export const { videoAdded, videoRemoved, videoRenamed } = videosSlice.actions;

export const selectVideos = (state: VideosState, isClip: boolean) => (isClip ? state.clips : state.recordings);

export default videosSlice.reducer;
