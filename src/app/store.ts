import { type AnyAction, configureStore, type Dispatch } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import videosSlice from "@/videos/videosSlice";
import settingsSlice from "@/settings/settingsSlice";
import recorderSlice from "@/libs/recorder/recorderSlice";
import PathHelper from "@/libs/helpers/pathHelper";
import { promises as fs } from "fs";
import { DEFAULT_SETTINGS } from "./constants";
import RecordingsManager from "@/libs/recorder/recordingsManager";
import File from "@/libs/helpers/file";
import type { Video } from "@/videos/types";
import { logger } from "@/libs/logger";
import uploadersSlice from "@/libs/uploaders/uploadersSlice";

const saver = (store: any) => (next: Dispatch<AnyAction>) => async (action: AnyAction) => {
  try {
    logger.info("saver", action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    if (action.type.startsWith("settings/")) {
      // Remove app settings - we don't want them in the settings.json file.
      const settingsState: any = {};
      Object.assign(settingsState, store.getState().settings);
      delete settingsState.app;

      const settingsFile = await PathHelper.getFile("settings");
      fs.writeFile(settingsFile, JSON.stringify(settingsState, null, 2)).catch((e) => {
        throw new Error(`Error writing updated settings to ${settingsFile}:`, e);
      });
    } else if (action.type.startsWith("uploaders/")) {
      const state: any = {};
      Object.assign(state, store.getState().uploaders);

      const file = await PathHelper.getFile("uploaders");
      fs.writeFile(file, JSON.stringify(state, null, 2)).catch((e) => {
        throw new Error(`Error writing updated connections to ${file}:`, e);
      });
    } else if (action.type.startsWith("videos/")) {
      // HACK sorta.. might need to change how this works if there is
      // ever an action that doesn't have isClip accessible like this
      const isClip = action.payload.isClip;
      logger.info("saver", "Video state changed, writing changes to file. isClip:", isClip);
      if (isClip === true || isClip === false) {
        const f = await PathHelper.getFile(isClip ? "clips" : "recordings");
        if (action.type.includes("videos/videoAdded")) {
          // Actions where should append to file instead of replace all
          await fs.appendFile(f, RecordingsManager.toWritingReady(action.payload, true));
        } else {
          const vidState = store.getState().videos;
          const tow = RecordingsManager.toWritingReady(isClip ? vidState.clips : vidState.recordings, false);
          // Default to replace file for all other actions
          console.log("saving videos", f, tow);
          await fs.writeFile(f, tow);
        }
      } else {
        logger.error(
          "saver",
          "Video action payload does not include accessible `isClip` property! Skipping save!",
          action.payload
        );
      }
    }

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  } catch (e: any) {
    throw Error(`Error saving updated state`, e);
  }
};

const rehydrated = async () => {
  try {
    // Create reh var and clone default values into it.
    const reh = {
      settings: { ...DEFAULT_SETTINGS },
      uploaders: {},
      videos: {
        recordings: [] as Video[],
        clips: [] as Video[]
      }
    };

    // Settings
    try {
      const stgsFile = await PathHelper.getFile("settings");
      const r = await fs.readFile(stgsFile, "utf-8");
      if (r) {
        const rjson = JSON.parse(r);
        reh.settings.general = { ...DEFAULT_SETTINGS.general, ...rjson.general };
        reh.settings.recording = { ...DEFAULT_SETTINGS.recording, ...rjson.recording };
        reh.settings.key = { ...DEFAULT_SETTINGS.key, ...rjson.key };
      }
    } catch (err) {
      logger.error("rehydrate", "Couldn't restore settings:", err);
    }

    // Uploaders
    try {
      const file = await PathHelper.getFile("uploaders");
      const r = await fs.readFile(file, "utf-8");
      if (r) {
        const rjson = JSON.parse(r);
        reh.uploaders = rjson;
      }
    } catch (err) {
      logger.error("rehydrate", "Couldn't restore uploaders:", err);
    }

    const readVideoFile = async (clips: boolean): Promise<Video[]> => {
      return (
        (await File.readContinuousJsonFile(await PathHelper.getFile(clips ? "clips" : "recordings"))) as Video[]
      ).map((v) => {
        return { ...v, isClip: clips };
      });
    };

    try {
      const recordings = await readVideoFile(false);
      if (recordings && recordings.length > 0) Object.assign(reh.videos.recordings, recordings);
    } catch (err) {
      logger.error("rehydrate", "Couldn't restore past recordings:", err);
    }

    try {
      const clips = await readVideoFile(true);
      if (clips && clips.length > 0) Object.assign(reh.videos.clips, clips);
    } catch (err) {
      logger.error("rehydrate", "Couldn't restore clips:", err);
    }

    console.groupCollapsed("Restored State");
    logger.info("rehydrate", "Settings", reh.settings);
    logger.info("rehydrate", "Uploaders"); // Don't want peoples access tokens logged
    logger.info("rehydrate", "Recordings", reh.videos.recordings);
    logger.info("rehydrate", "Clips", reh.videos.clips);
    console.groupEnd();

    return reh;
  } catch (e: any) {
    throw Error(`Error fetching saved state`, e);
  }
};

export const store = configureStore({
  reducer: {
    app: appSlice,
    videos: videosSlice,
    settings: settingsSlice,
    recorder: recorderSlice,
    uploaders: uploadersSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saver),
  preloadedState: await rehydrated()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
