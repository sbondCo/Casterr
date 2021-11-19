const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  }
});
