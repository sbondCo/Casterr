import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import commonjsExternals from "vite-plugin-commonjs-externals";
import { builtinModules } from "module";

const commonjsPackages = [
  // Electron
  "electron",
  "electron/main",
  "electron/common",
  "electron/renderer",
  // Node
  ...builtinModules,
  // Custom
  "winston",
  "winston-daily-rotate-file"
];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3060,
    strictPort: true
  },
  plugins: [commonjsExternals({ externals: commonjsPackages }), react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src")
      }
    ]
  },
  build: {
    sourcemap: true,
    target: "chrome98",
    outDir: "./dist/vi",
    emptyOutDir: true,
    assetsDir: "./"
  },
  // The script/style src paths need to be relative.
  // Removing the default '/' at start by setting base to empty.
  base: ""
});
