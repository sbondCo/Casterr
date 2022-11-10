// // import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { app, protocol, BrowserWindow, ipcMain, screen, dialog, OpenDialogOptions } from "electron";
import path from "path";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";

const isDev = process.env.NODE_ENV !== "production";

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
    // createProtocol("app");

    // Load the index.html when not in development
    win.loadURL(`file://${path.join(__dirname, "index.html")}`);
  }
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
    notifWin.once("ready-to-show", () => notifWin.show());

    if (isDev && process.env.SERVER_URL) {
      // Load the url of the dev server if in development mode
      await notifWin.loadURL(`${process.env.SERVER_URL}/dnotif/${args.icon}/${args.desc}`);
    } else {
      // Load the index.html when not in development
      notifWin.loadURL(`file://${path.join(__dirname, `index.html#dnotif/${args.icon}/${args.desc}`)}`); // TEST THIS IN A BUILD
    }

    // Close window after defined duration
    setTimeout(() => {
      notifWin.close();
    }, args.duration);
  });

  /**
   * Show open dialog with args passed through.
   */
  ipcMain.handle("show-open-dialog", async (_, args: OpenDialogOptions) => {
    return new Promise((resolve, reject) => {
      dialog
        .showOpenDialog(win, { ...args })
        .then((v) => resolve(v))
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
  // Install devtools if in development mode
  if (isDev && !process.env.IS_TEST) {
    await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], true)
      .then((name) => console.log(`Added Extension: ${name}`))
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
