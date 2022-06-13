/**
 * This script probably doesn't work on windows..
 * will fix when I get to fixing all errors on windows later.
 */

import { get } from "http";
import { ChildProcess, exec } from "child_process";
import { Stats, watchFile } from "fs";

type LogPrefix = "srve" | "elec" | "vite";

const NODE_BIN = "./node_modules/.bin";
const ATTEMPTS = Infinity;
const DELAY = 500;

let electron: ChildProcess | undefined;
let vite: ChildProcess;
let restarting: boolean = false;

async function start() {
  log("Starting tasks");

  vite = exec(`${NODE_BIN}/vite`);
  listen(vite, "vite");

  electron = await openElectron();
  listen(electron, "elec");

  const restart = async (curr: Stats, prev: Stats, f: string) => {
    // If already restarting return
    if (restarting) return;

    if (+curr.mtime - +prev.mtime) {
      log(`Detected changes in ${f}, restarting Electron.`);

      restarting = true;
      // const epid = electron!.pid;

      electron!.kill("SIGTERM");
      await new Promise((r) => setTimeout(r, DELAY));

      log(`Building entry scripts.`);
      const buildProc = exec("npm run build:entry-scripts");
      buildProc.on("exit", async () => {
        electron = undefined;
        electron = await openElectron();
        listen(electron, "elec");

        restarting = false;
        log(`Done.`);
      });

      // for (let i = 0; i < ATTEMPTS; i++) {
      //   try {
      //     // Try kill process, if errors below we know it has exited
      //     process.kill(epid!, 0);
      //   } catch (e: any) {
      //     // ESRCH: process doesn't exist, so we successfully terminated it.
      //     if (e.code === "ESRCH") break;
      //     else console.error("Error checking if process killed", e);
      //   }

      // await new Promise((r) => setTimeout(r, DELAY));
      // }
    }
  };

  // TODO: Make this restart app automatically preload or background script changed
  watchFile("entry/preload.ts", (curr, prev) => restart(curr, prev, "preload.ts"));
  watchFile("entry/background.ts", (curr, prev) => restart(curr, prev, "background.ts"));
}

function openElectron() {
  return new Promise<ChildProcess>(async (resolve) => {
    const viteBase = "http://localhost:3060";

    for (let i = 0; i < ATTEMPTS; i++) {
      // If electron is set, make sure for loop exits
      if (electron) break;

      get(`${viteBase}/src/main.tsx`, (resp) => {
        // If was able to get main.tsx, then vite has
        // launched the react app, so we can now open Electron
        if (resp.statusCode == 200) {
          resolve(exec(`NODE_ENV=dev SERVER_URL=${viteBase} ${NODE_BIN}/electron .`));
        } else {
          log(`Recieved HTTP code ${resp.statusCode} from vite!`);
        }
      }).on("error", () => {
        log(`App not available yet, retrying in ${DELAY}ms`);
      });

      await new Promise((r) => setTimeout(r, DELAY));
    }
  });
}

async function listen(proc: ChildProcess, prefix: LogPrefix) {
  proc.stdout?.on("data", (chunk) => log(chunk, prefix));
  proc.stderr?.on("data", (chunk) => log(chunk, prefix));

  proc.on("close", () => {
    if (!restarting) {
      log(`${prefix} was closed, stopping other tasks.`);
      process.kill(0);
    }
  });
}

async function log(msg: string, prefix: LogPrefix = "srve") {
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

start();
