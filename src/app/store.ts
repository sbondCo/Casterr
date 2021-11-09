import { configureStore } from "@reduxjs/toolkit";
import videosSlice from "@/videos/videosSlice";

export const store = configureStore({
  reducer: {
    videos: videosSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
