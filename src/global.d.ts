import { PlatformPath } from "path";
import os from "node:os";
import fs from "fs";
import { mainAPI, nodeAPI } from "entry/preload";

export {};

declare global {
  interface Window {
    // Created in electron preload script
    api: mainAPI;

    node: nodeAPI;

    // node: {
    //   fs: typeof fs;

    //   path: PlatformPath;

    //   os: typeof os;
    // };
  }
}
