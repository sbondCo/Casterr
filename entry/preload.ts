import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  }
});

contextBridge.exposeInMainWorld("node", {
  fs: {
    existsSync: (path: fs.PathLike) => {
      return fs.existsSync(path);
    },
    writeFile: (
      file: fs.PathOrFileDescriptor,
      data: string | NodeJS.ArrayBufferView,
      options: fs.WriteFileOptions,
      callback: fs.NoParamCallback
    ) => {
      return fs.writeFile(file, data, options, callback);
    },
    writeFileSync: (
      file: fs.PathOrFileDescriptor,
      data: string | NodeJS.ArrayBufferView,
      options?: fs.WriteFileOptions
    ) => {
      return fs.writeFileSync(file, data, options);
    },
    mkdirSync: (path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions | null) => {
      return fs.mkdirSync(path, options);
    }
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
});
