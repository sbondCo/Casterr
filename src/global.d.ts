import { mainAPI, nodeAPI } from "../entry/preload";

export {};

declare global {
  interface Window {
    // Created in electron preload script
    api: mainAPI;
    node: nodeAPI;
  }
}
