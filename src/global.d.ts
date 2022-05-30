import { PlatformPath } from "path";
import os from "node:os";

export {};

declare global {
  interface Window {
    // Created in electron preload script
    api: any;
    node: {
      path: PlatformPath;

      os: typeof os;
    };
  }
}
