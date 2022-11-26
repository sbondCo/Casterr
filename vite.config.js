import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import commonjsExternals from "vite-plugin-commonjs-externals";

const commonjsPackages = [
  // Electron
  "electron",
  "electron/main",
  "electron/common",
  "electron/renderer",
  // Node
  "assert",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "diagnostics_channel",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "inspector",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib"
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
        replacement: path.resolve(__dirname, "/src")
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
