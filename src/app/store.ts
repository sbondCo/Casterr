import { configureStore } from "@reduxjs/toolkit";
import videosSlice from "@/videos/videosSlice";
import settingsSlice from "@/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    videos: videosSlice,
    settings: settingsSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
