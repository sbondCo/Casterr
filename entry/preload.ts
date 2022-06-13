import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  /**
   * Send an asynchronous message to the main process
   * https://www.electronjs.org/docs/latest/api/ipc-renderer/#ipcrenderersendchannel-args
   */
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },

  /**
   * Same as send, but we expect an asynchronous response.
   * https://www.electronjs.org/docs/latest/api/ipc-renderer/#ipcrendererinvokechannel-args
   */
  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args);
  }
});

const nodeAPI = {
  fs: {
    ...fs.promises,
    constants: fs.constants
  },
  path: {
    join: (...paths: string[]) => {
      return path.join(...paths);
    },
    dirname: (p: string) => {
      return path.dirname(p);
    },
    basename: (p: string, ext?: string) => {
      return path.basename(p, ext);
    },
    extname: (p: string) => {
      return path.extname(p);
    }
  },
  os: {
    homedir: () => {
      return os.homedir();
    }
  }
};

export type nodeAPI = typeof nodeAPI;

contextBridge.exposeInMainWorld("node", nodeAPI);
