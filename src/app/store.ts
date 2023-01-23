import { AnyAction, configureStore, Dispatch } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import videosSlice from "@/videos/videosSlice";
import settingsSlice from "@/settings/settingsSlice";
import recorderSlice from "@/libs/recorder/recorderSlice";
import PathHelper from "@/libs/helpers/pathHelper";
import { promises as fs } from "fs";
import { DEFAULT_SETTINGS } from "./constants";
import RecordingsManager from "@/libs/recorder/recordingsManager";
import File from "@/libs/helpers/file";
import { Video } from "@/videos/types";
import { logger } from "@/libs/logger";

const saver = (store: any) => (next: Dispatch<AnyAction>) => async (action: AnyAction) => {
  try {
    logger.info("saver", action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    if (action.type.includes("settings/")) {
      // Remove app settings - we don't want them in the settings.json file.
      const settingsState: any = {};
      Object.assign(settingsState, store.getState().settings);
      delete settingsState.app;

      const settingsFile = await PathHelper.getFile("settings");
      fs.writeFile(settingsFile, JSON.stringify(settingsState, null, 2)).catch((e) => {
        throw new Error(`Error writing updated settings to ${settingsFile}:`, e);
      });
    }

    if (action.type.includes("videos/")) {
      // HACK sorta.. might need to change how this works if there is
      // ever an action that doesn't have isClip accessible like this
      const isClip = action.payload.isClip;
      logger.info("saver", "Video state changed, writing changes to file. isClip:", isClip);
      if (isClip === true || isClip === false) {
        if (action.type.includes("videos/videoAdded")) {
          // Actions where should append to file instead of replace all
          await fs.appendFile(
            await PathHelper.getFile(isClip ? "clips" : "recordings"),
            RecordingsManager.toWritingReady(action.payload, true)
          );
        } else {
          const vidState = store.getState().videos;
          // Default to replace file for all other actions
          await fs.writeFile(
            await PathHelper.getFile(isClip ? "clips" : "recordings"),
            RecordingsManager.toWritingReady(isClip ? vidState.clips : vidState.recordings, false)
          );
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
      settings: {},
      videos: {
        recordings: [] as Video[],
        clips: [] as Video[]
      }
    };

    // Assigning directly above causes unoverridable error.
    Object.assign(reh.settings, DEFAULT_SETTINGS);

    try {
      const stgsFile = await PathHelper.getFile("settings");
      const r = await fs.readFile(stgsFile, "utf-8");
      if (r) Object.assign(reh.settings, JSON.parse(r));
    } catch (err) {
      logger.error("rehydrate", "Couldn't restore settings:", err);
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
    recorder: recorderSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saver),
  preloadedState: await rehydrated()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
