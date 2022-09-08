import { AnyAction, configureStore, Dispatch } from "@reduxjs/toolkit";
import videosSlice from "@/videos/videosSlice";
import settingsSlice from "@/settings/settingsSlice";
import recorderSlice from "@/libs/recorder/recorderSlice";
import PathHelper from "@/libs/helpers/pathHelper";
import { promises as fs } from "fs";
import { DEFAULT_SETTINGS } from "./constants";
import RecordingsManager from "@/libs/recorder/recordingsManager";

const saver = (store: any) => (next: Dispatch<AnyAction>) => async (action: AnyAction) => {
  try {
    console.log("saver:", action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    if (action.type.includes("settings/")) {
      // Remove app settings - we don't want them in the settings.json file.
      const settingsState: any = {};
      Object.assign(settingsState, store.getState().settings);
      delete settingsState.app;

      const settingsFile = await PathHelper.getFile("settings");
      fs.writeFile(settingsFile, JSON.stringify(settingsState, null, 2)).catch((e) => {
        throw new Error(`Error writing updated settings to ${settingsFile}: ${e}`);
      });
    }

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  } catch (e) {
    throw Error(`Error saving updated state ${e}`);
  }
};

const rehydrated = async () => {
  try {
    // Create reh var and clone default values into it.
    let reh = {} as any;
    reh.settings = {};
    Object.assign(reh.settings, DEFAULT_SETTINGS);
    reh.videos = {};
    reh.videos.recordings = [];
    reh.videos.clips = [];

    try {
      const stgsFile = await PathHelper.getFile("settings");
      const r = await fs.readFile(stgsFile, "utf-8");
      if (r) Object.assign(reh.settings, JSON.parse(r));
    } catch (err) {
      console.error("Couldn't restore settings:", err);
    }

    try {
      const recordings = await RecordingsManager.get(false);
      if (recordings && recordings.length > 0) Object.assign(reh.videos.recordings, recordings);
    } catch (err) {
      console.error("Couldn't restore past recordings:", err);
    }

    try {
      const clips = await RecordingsManager.get(true);
      if (clips && clips.length > 0) Object.assign(reh.videos.clips, clips);
    } catch (err) {
      console.error("Couldn't restore clips:", err);
    }

    console.groupCollapsed("Restored State");
    console.log("Settings", reh.settings);
    console.log("Recordings", reh.videos.recordings);
    console.log("Clips", reh.videos.clips);
    console.groupEnd();

    return reh;
  } catch (e) {
    throw Error(`Error fetching saved state ${e}`);
  }
};

export const store = configureStore({
  reducer: {
    videos: videosSlice,
    settings: settingsSlice,
    recorder: recorderSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saver),
  preloadedState: await rehydrated()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
