import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  }
});

const nodeAPI = {
  fs: fs,
  // fs: {
  //   existsSync: (path: fs.PathLike) => {
  //     return fs.existsSync(path);
  //   },
  //   readFile: (path: fs.PathOrFileDescriptor, callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void) => {
  //     return fs.readFile(path, callback);
  //   },
  //   readdir: (path: fs.PathLike, callback: (err: NodeJS.ErrnoException | null, files: string[]) => void) => {
  //     return fs.readdir(path, callback);
  //   },
  //   rmdirSync: (path: fs.PathLike, options?: fs.RmDirOptions | undefined) => {
  //     return fs.rmdirSync(path, options);
  //   },
  //   unlink: (path: fs.PathLike, callback: fs.NoParamCallback) => {
  //     return fs.unlink(path, callback);
  //   },
  //   unlinkSync: (path: fs.PathLike) => {
  //     return fs.unlinkSync(path);
  //   },
  //   writeFile: (
  //     file: fs.PathOrFileDescriptor,
  //     data: string | NodeJS.ArrayBufferView,
  //     options: fs.WriteFileOptions,
  //     callback: fs.NoParamCallback
  //   ) => {
  //     return fs.writeFile(file, data, options, callback);
  //   },
  //   writeFileSync: (
  //     file: fs.PathOrFileDescriptor,
  //     data: string | NodeJS.ArrayBufferView,
  //     options?: fs.WriteFileOptions
  //   ) => {
  //     return fs.writeFileSync(file, data, options);
  //   },
  //   mkdirSync: (path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions | null) => {
  //     return fs.mkdirSync(path, options);
  //   }
  // },
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
