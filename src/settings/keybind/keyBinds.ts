import { store } from "@/app/store";
import { ipcRenderer } from "electron";
import { KeyBindingSettings } from "./../types";

// !!! Make sure this works always! When you have no config, it may not be created with default key binds in it.
// Either make sure its populated on launch or combine it with DEFAULT_SETTINGS

/**
 * For run on startup to register all keybinds.
 */
export function registerAllBinds() {
  console.log("Registering all key binds.");
  const keyBinds = store.getState().settings.key;

  // Unregister all keybinds first, useful incase refresh occurs and binds are still applied already.
  ipcRenderer.send("unregister-all-keybinds");

  for (const key in keyBinds) {
    if (Object.prototype.hasOwnProperty.call(keyBinds, key)) {
      const bind = keyBinds[key as keyof KeyBindingSettings];
      console.log(key, ":", bind);
      ipcRenderer
        .invoke("register-keybind", key, bind)
        .then((success) => {
          if (!success) console.error("Failed to register", key, "to", bind);
        })
        .catch((err) => console.error("Error registering keybind", key, "to", bind, ":", err));
    }
  }

  startBindPressedListener();
}

/**
 * Update a keybind, when user changes the keys for the bind.
 */
export async function updateBind(name: string, newBind: string, oldBind: string) {
  return await ipcRenderer.invoke("register-keybind", name, newBind, oldBind);
}

function startBindPressedListener() {
  ipcRenderer.on("bind-pressed", (_, name: string) => {
    console.log("Bind for", name, "pressed");
  });
}
