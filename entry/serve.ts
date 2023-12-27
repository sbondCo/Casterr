/**
 * This script probably doesn't work on windows..
 * will fix when I get to fixing all errors on windows later.
 */

import { get } from "http";
import { type ChildProcess, exec } from "child_process";
import { type Stats, watchFile } from "fs";
import path from "path";

type LogPrefix = "srve" | "elec" | "vite";

const NODE_BIN = path.join("./", "node_modules", ".bin");
const VITE_PATH = path.join(NODE_BIN, "vite");
const ELECTRON_PATH = path.join(NODE_BIN, "electron");
const CROSSENV_PATH = path.join(NODE_BIN, "cross-env");
const ATTEMPTS = Infinity;
const DELAY = 500;

let electron: ChildProcess | undefined;
let vite: ChildProcess;
let restarting: boolean = false;

async function start() {
  log("Starting tasks");

  vite = exec(VITE_PATH);
  listen(vite, "vite").catch((e) => {
    log("Failed to attach listener to vite process.");
  });

  electron = await openElectron();
  listen(electron, "elec").catch((e) => {
    log("Failed to attach listener to electron process.");
  });

  const restart = async (curr: Stats, prev: Stats, f: string) => {
    // If already restarting return
    if (restarting) return;

    if (+curr.mtime - +prev.mtime) {
      log(`Detected changes in ${f}, restarting Electron.`);

      restarting = true;
      electron?.kill("SIGTERM");
      await new Promise((resolve) => setTimeout(resolve, DELAY));

      log(`Building entry scripts.`);

      const buildProc = exec("npm run build:entry-scripts");
      buildProc.on("exit", async () => {
        electron = undefined;
        electron = await openElectron();
        listen(electron, "elec").catch((e) => {
          log("Failed to attach listener to electron process.");
        });

        restarting = false;
        log(`Done.`);
      });
    }
  };

  watchFile("entry/background.ts", async (curr, prev) => {
    await restart(curr, prev, "background.ts");
  });
}

async function openElectron() {
  // eslint-disable-next-line no-async-promise-executor
  return await new Promise<ChildProcess>(async (resolve) => {
    const viteBase = "http://localhost:3060";

    for (let i = 0; i < ATTEMPTS; i++) {
      // If electron is set, make sure for loop exits
      if (electron) break;

      get(`${viteBase}/src/main.tsx`, (resp) => {
        // If was able to get main.tsx, then vite has
        // launched the react app, so we can now open Electron
        if (resp.statusCode === 200) {
          log(`Starting Casterr..`);
          resolve(exec(`${CROSSENV_PATH} NODE_ENV=dev SERVER_URL=${viteBase} ${ELECTRON_PATH} .`));
        } else {
          log(`Recieved HTTP code ${resp.statusCode ?? "UNDEFINED"} from vite!`);
        }
      }).on("error", () => {
        log(`App not available yet, retrying in ${DELAY}ms`);
      });
      await new Promise((resolve) => setTimeout(resolve, DELAY));
    }
  });
}

async function listen(proc: ChildProcess, prefix: LogPrefix) {
  proc.stdout?.on("data", (chunk) => {
    log(chunk, prefix);
  });
  proc.stderr?.on("data", (chunk) => {
    log(chunk, prefix);
  });

  proc.on("close", () => {
    // Only kill main process if we aren't restarting a service.
    if (!restarting) {
      log(`${prefix} was closed, stopping other tasks.`);
      process.kill(0);
    }
  });
}

function log(msg: string, prefix: LogPrefix = "srve") {
  const text = msg.split("\n").map((line) => {
    return `[${coloured(prefix)}] ${line}`;
  });

  console.log(`${text.join("\n")}`);
}

function coloured(prefix: string) {
  let colour = "\x1b[35m";

  switch (prefix) {
    case "elec":
      colour = "\x1b[34m";
      break;
    case "vite":
      colour = "\x1b[32m";
      break;
  }

  return `${colour}${prefix}\x1b[0m`;
}

start().catch((e) => {
  console.error("Failed to start serve:", e);
});
