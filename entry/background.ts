import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  screen,
  dialog,
  type OpenDialogOptions,
  globalShortcut
} from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";

const isDev = process.env.NODE_ENV === "dev";
let updateCheckTriggeredManually = false;

console.log(`Running Casterr ${app.getVersion()}. Dev Mode:`, isDev);

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
      nodeIntegration: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: false
    }
  });

  registerChannels(win);

  if (isDev && process.env.SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.SERVER_URL);

    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    // Load the index.html when not in development
    await win.loadURL(`file://${path.join(__dirname, "../../dist/vi/index.html")}`);
  }

  return win;
}

/**
 * Register and handle all ipc channels.
 * @param win Main window.
 */
function registerChannels(win: BrowserWindow) {
  /**
   * Manage current state of window.
   */
  ipcMain.on("manage-window", (_, args) => {
    switch (args) {
      case "max":
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
        break;
      case "min":
        win.minimize();
        break;
      case "close":
        win.close();
        break;
    }
  });

  /**
   * Create desktop notification window and display correct message to user.
   */
  ipcMain.on("create-desktop-notification", async (_, args: { desc: string; icon: string; duration: number }) => {
    const screenWithCursor = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    const notifWin = new BrowserWindow({
      parent: win,
      width: 400,
      height: 80,
      x: screenWithCursor.bounds.x + screenWithCursor.bounds.width / 2 - 400 / 2, // Middle of screen horizontally
      y: screenWithCursor.bounds.y + 50,
      frame: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      resizable: false,
      hasShadow: false,
      transparent: true,
      movable: false,
      focusable: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false,
        contextIsolation: false
      }
    });

    // Show window when ready to show
    notifWin.once("ready-to-show", () => {
      notifWin.show();
    });

    if (isDev && process.env.SERVER_URL) {
      // Load the url of the dev server if in development mode
      await notifWin.loadURL(`${process.env.SERVER_URL}/index.html#/dnotif/${args.icon}/${args.desc}`);
    } else {
      // Load the index.html when not in development
      await notifWin.loadURL(
        `file://${path.join(__dirname, `../../dist/vi/index.html`)}#/dnotif/${args.icon}/${args.desc}`
      );
    }

    // Close window after defined duration
    setTimeout(() => {
      notifWin.close();
    }, args.duration);
  });

  ipcMain.handle("select-region-win", async () => {
    console.log("select-region-win running");
    // TODO probably need to spawn a window on each screen..
    const screenWithCursor = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    const regionWin = new BrowserWindow({
      parent: win,
      width: screenWithCursor.bounds.width,
      height: screenWithCursor.bounds.height,
      x: screenWithCursor.bounds.x,
      y: screenWithCursor.bounds.y,
      frame: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      resizable: false,
      hasShadow: false,
      transparent: true,
      movable: false,
      focusable: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false,
        contextIsolation: false
      }
    });

    // Show window when ready to show
    regionWin.once("ready-to-show", () => {
      regionWin.show();
    });

    if (isDev && process.env.SERVER_URL) {
      // Load the url of the dev server if in development mode
      await regionWin.loadURL(`${process.env.SERVER_URL}/index.html#/region_select`);
    } else {
      // Load the index.html when not in development
      await regionWin.loadURL(`file://${path.join(__dirname, `../../dist/vi/index.html`)}#/region_select`);
    }

    return await new Promise((resolve, reject) => {
      regionWin.once("closed", () => {
        reject(new Error("window closed before capturing a region"));
      });

      ipcMain.once("region-select-cancelled", (_, reason: string, err?: Error) => {
        try {
          regionWin?.close();
          console.error("region-select-cancelled err:", err);
          reject(new Error(reason));
        } catch (err) {
          console.error("region-select-cancelled listener failed", err);
        }
      });

      ipcMain.once("region-selected", (_, bounds) => {
        try {
          regionWin?.close();
          resolve(bounds);
        } catch (err) {
          console.error("region-selected listener failed", err);
        }
      });
    });
  });

  /**
   * Show open dialog with args passed through.
   */
  ipcMain.handle("show-open-dialog", async (_, args: OpenDialogOptions) => {
    return await new Promise((resolve, reject) => {
      dialog
        .showOpenDialog(win, { ...args })
        .then((v) => {
          resolve(v);
        })
        .catch(reject);
    });
  });

  /**
   * Get all monitors.
   */
  ipcMain.handle("get-screens", async () => {
    return screen.getAllDisplays();
  });

  /**
   * Get primary monitor.
   */
  ipcMain.handle("get-primary-screen", async () => {
    return screen.getPrimaryDisplay();
  });

  /**
   * Register a keybind.
   * @param bind The bind to register.
   * @param oldBind If provided, will first unbind the old bind. Useful for when updating a bind and we want to unbind the old one first.
   */
  ipcMain.handle("register-keybind", (_, name: string, bind: string, oldBind: string | undefined) => {
    if (oldBind) {
      globalShortcut.unregister(oldBind);
    }
    return globalShortcut.register(bind, () => {
      win.webContents.send(`${name}-pressed`);
    });
  });

  /**
   * Unregister all keybinds.
   */
  ipcMain.on("unregister-all-keybinds", () => {
    globalShortcut.unregisterAll();
  });

  /**
   * Quit and install update.
   */
  ipcMain.on("install-update", () => {
    autoUpdater.quitAndInstall();
  });

  /**
   * Check for updates again **user triggered**.
   */
  ipcMain.on("update-check", () => {
    updateCheckTriggeredManually = true;
    autoUpdater.checkForUpdates().catch((err) => {
      console.error("Failed to check for updates:", err);
    });
  });

  /**
   * Return app version info.
   */
  ipcMain.handle("get-version", () => {
    return app.getVersion();
  });
}

function runUpdateCheck(win: BrowserWindow) {
  const winWC = win.webContents;

  autoUpdater.on("checking-for-update", () => {
    console.log("UPDATER: checking-for-update");
    winWC.send("checking-for-update");
  });

  autoUpdater.on("update-available", (info) => {
    console.log("UPDATER: update-available", info);
    winWC.send("update-available", info);
  });

  autoUpdater.on("update-not-available", (info) => {
    console.log("UPDATER: update-not-available", info);
    winWC.send("update-not-available", updateCheckTriggeredManually);
  });

  autoUpdater.on("error", (err) => {
    console.log("UPDATER: error", err);
    winWC.send("update-error", err);
  });

  autoUpdater.on("download-progress", (progressObj) => {
    console.log("UPDATER: download-progress", progressObj);
    winWC.send("update-download-progress", progressObj);
  });

  autoUpdater.on("update-downloaded", (info) => {
    console.log("UPDATER: update-downloaded", info);
    winWC.send("update-downloaded", info);
  });

  updateCheckTriggeredManually = false;
  autoUpdater.checkForUpdates().catch((err) => {
    console.error("Failed to check for updates:", err);
  });
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

app.on("activate", async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) await createWindow();
});

/**
 * When Electron is finished initializing
 */
app.on("ready", async () => {
  // Install devtools if in development mode
  if (isDev && !process.env.IS_TEST) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = await import("electron-devtools-installer");
    await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], true)
      .then((name) => {
        console.log(`Added Extension: ${name}`);
      })
      .catch((err) => {
        console.log("An error occurred: ", err);
      });
  }

  // Create file protocol, so we can access users files
  const protocolName = "secfile";
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, "");
    try {
      callback(decodeURIComponent(url));
      return;
    } catch (error) {
      // Handle the error as needed
      console.error(error);
    }
  });

  const window = await createWindow();
  runUpdateCheck(window);
});

/**
 * Exit cleanly on request from parent process in development mode
 */
if (isDev) {
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
