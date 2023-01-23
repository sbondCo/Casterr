import { store } from "@/app/store";
import { logger } from "@/libs/logger";
import { ipcRenderer } from "electron";
import { KeyBindingSettings } from "./../types";

/**
 * For run on startup to register all keybinds.
 */
export function registerAllBinds() {
  logger.info("KeyBinds", "Registering all key binds.");
  const keyBinds = store.getState().settings.key;

  // Unregister all keybinds first, useful incase refresh occurs and binds are still applied already.
  ipcRenderer.send("unregister-all-keybinds");

  for (const key in keyBinds) {
    if (Object.prototype.hasOwnProperty.call(keyBinds, key)) {
      const bind = keyBinds[key as keyof KeyBindingSettings];
      logger.debug("KeyBinds", key, ":", bind);
      ipcRenderer
        .invoke("register-keybind", key, bind)
        .then((success) => {
          if (!success) logger.error("KeyBinds", "Failed to register", key, "to", bind);
        })
        .catch((err) => logger.error("KeyBinds", "Error registering keybind", key, "to", bind, ":", err));
    }
  }
}

/**
 * Update a keybind, when user changes the keys for the bind.
 */
export async function updateBind(name: string, newBind: string, oldBind: string) {
  return await ipcRenderer.invoke("register-keybind", name, newBind, oldBind);
}
