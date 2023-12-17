import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VideosState, Video } from "./types";
import { removeFirst } from "@/libs/helpers/extensions/array";

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
    videoRenamed: (state, action: PayloadAction<{ videoPath: string; newName: string; isClip: boolean }>) => {
      const updt = (v: Video) => {
        if (v.videoPath === action.payload.videoPath) {
          v.name = action.payload.newName;
        }
        return v;
      };

      if (action.payload.isClip) {
        state.clips = state.clips.map(updt);
      } else {
        state.recordings = state.recordings.map(updt);
      }
    },
    videoBookmarkAdded: (state, action: PayloadAction<{ videoPath: string; isClip: boolean; bookmark: number }>) => {
      const updt = (v: Video) => {
        if (v.videoPath === action.payload.videoPath) {
          if (v.bookmarks) {
            v.bookmarks.push(action.payload.bookmark);
          } else {
            v.bookmarks = [action.payload.bookmark];
          }
        }
        return v;
      };

      if (action.payload.isClip) {
        state.clips = state.clips.map(updt);
      } else {
        state.recordings = state.recordings.map(updt);
      }
    },
    videoBookmarkRemoved: (state, action: PayloadAction<{ videoPath: string; isClip: boolean; bookmark: number }>) => {
      const updt = (v: Video) => {
        if (v.videoPath === action.payload.videoPath) {
          if (v.bookmarks) {
            v.bookmarks = removeFirst(v.bookmarks, action.payload.bookmark);
          }
        }
        return v;
      };

      if (action.payload.isClip) {
        state.clips = state.clips.map(updt);
      } else {
        state.recordings = state.recordings.map(updt);
      }
    }
  }
});

export const { videoAdded, videoRemoved, videoRenamed, videoBookmarkAdded, videoBookmarkRemoved } = videosSlice.actions;

export const selectVideos = (state: VideosState, isClip: boolean) => (isClip ? state.clips : state.recordings);

export default videosSlice.reducer;
