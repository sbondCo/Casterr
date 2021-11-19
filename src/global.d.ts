export {};

declare global {
  interface Window {
    // Created in electron preload script
    api: any;
  }
}
