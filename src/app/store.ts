import { AnyAction, configureStore, Dispatch } from "@reduxjs/toolkit";
import videosSlice from "@/videos/videosSlice";
import settingsSlice from "@/settings/settingsSlice";
import PathHelper from "@/libs/helpers/pathHelper";
import { FS, OS, Path } from "@/libs/node";
import { Settings } from "@/settings/types";
import { DEFAULT_SETTINGS } from "./constants";

const saver = (store: any) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  try {
    console.log("saver:", action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    if (action.type.includes("settings/")) {
      // Remove app settings - we don't want them in the settings.json file.
      const settingsState: any = {};
      Object.assign(settingsState, store.getState().settings);
      delete settingsState.app;

      FS.writeFile(PathHelper.getFile("settings"), JSON.stringify(settingsState, null, 2), (err) => {
        if (err) throw err;
        else console.info("Updated settings.json");
      });
    }

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  } catch (e) {
    throw Error(`Error saving updated state ${e}`);
  }
};

const rehydrated = () => {
  try {
    let reh = {} as any;

    reh.settings = {};
    Object.assign(reh.settings, DEFAULT_SETTINGS);

    const stgsFile = PathHelper.getFile("settings");
    if (FS.existsSync(stgsFile)) {
      const r = FS.readFileSync(stgsFile, "utf-8");
      if (r) Object.assign(reh.settings, JSON.parse(r));
    }

    return reh;
  } catch (e) {
    throw Error(`Error fetching saved state ${e}`);
  }
};

export const store = configureStore({
  reducer: {
    videos: videosSlice,
    settings: settingsSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saver),
  preloadedState: rehydrated()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
