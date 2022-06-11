import { PlatformPath } from "path";
import os from "node:os";
import fs from "fs";
import { nodeAPI } from "entry/preload";

export {};

declare global {
  interface Window {
    // Created in electron preload script
    api: any;

    node: nodeAPI;

    // node: {
    //   fs: typeof fs;

    //   path: PlatformPath;

    //   os: typeof os;
    // };
  }
}
