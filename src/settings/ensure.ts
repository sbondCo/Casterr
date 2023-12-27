import { store } from "@/app/store";
import DeviceManager from "@/libs/recorder/deviceManager";
import { logger } from "@/libs/logger";
import Notifications from "@/libs/helpers/notifications";
import { removeAudioDevicesToRecord } from "./settingsSlice";

/**
 * Check settings state to ensure they are correct.
 */
export default async function checkSettings() {
  try {
    const s = store.getState().settings;
    await checkAudioDevicesToRecord(s?.recording?.audioDevicesToRecord);
  } catch (err) {
    logger.error("settings/ensure", "checkSettings failed!", err);
  }
}

/**
 * Ensure configures audio devices to record are
 * available to us, if not remove and show popup
 * to alert user their audio device was removed.
 */
async function checkAudioDevicesToRecord(s: string[]) {
  const dRm: string[] = [];
  try {
    if (s?.length < 0) {
      logger.debug("settings/ensure", "checkAudioDevicesToRecord recieved to no devices.. skipping check.");
      return;
    }
    const devs = await DeviceManager.getDevices();
    if (devs?.audio?.length < 0) {
      logger.info("settings/ensure", "checkAudioDevicesToRecord found no audio devices.");
      return;
    }
    for (let i = 0; i < s.length; i++) {
      const adtr = s[i];
      if (!devs.audio.find((d) => d.id === adtr)) {
        logger.info("settings/ensure", "checkAudioDevicesToRecord found non existant audio device:", adtr);
        dRm.push(adtr);
      } else {
        logger.info("settings/ensure", "checkAudioDevicesToRecord audio device exists:", adtr);
      }
    }
  } catch (err) {
    logger.error("settings/ensure", "checkAudioDevicesToRecord failed!", err);
  }
  if (dRm.length > 0) {
    store.dispatch(removeAudioDevicesToRecord(dRm));
    await Notifications.popup({
      id: "SETTINGS-ENSURE-ADTR",
      title: "Removed Unrecognized Audio Devices",
      message:
        "One or more audio devices to record were no longer recognized. Please re-configure this option in settings.",
      showCancel: true
    });
  }
}
