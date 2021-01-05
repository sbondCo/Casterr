"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import * as path from "path";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

/**
 * Create app window
 */
async function createWindow() {
  const iconPath = path.join(__dirname.replace("app.asar", ""), "../", "assets", "icons", "512x512.png");

  // Create the browser window.
  const win = new BrowserWindow({
    title: "Casterr",
    icon: iconPath,
    width: 1200,
    height: 650,
    minWidth: 800,
    minHeight: 500,
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);

    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");

    // Load the index.html when not in development
    win.loadURL(`file://${path.join(__dirname, "index.html")}`);
  }
}

/**
 * Make transparent windows work.
 * 'disable-gpu' alone works for me, but going to keep 'enable-transparent-visuals'
 * incase it works with other distros/hardware. Need to test later.
 */
app.commandLine.appendSwitch("enable-transparent-visuals");
app.commandLine.appendSwitch("disable-gpu");

/**
 * Quit when all windows are closed
 */
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

/**
 * When Electron is finished initializing
 */
app.on("ready", async () => {
  // Install VUEJS devtools if in development mode
  if (isDevelopment && !process.env.IS_TEST) {
    await installExtension(VUEJS_DEVTOOLS, true)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  }

  // Create file protocol, so we can access users files
  const protocolName = "secfile";
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, "");
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      // Handle the error as needed
      console.error(error);
    }
  });

  createWindow();
});

/**
 * Exit cleanly on request from parent process in development mode
 */
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
