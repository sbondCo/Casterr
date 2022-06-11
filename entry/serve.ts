/**
 * This script probably doesn't work on windows..
 * will fix when I get to fixing all errors on windows later.
 */

import { get } from "http";
import { ChildProcess, exec } from "child_process";
import { watchFile } from "fs";

const NODE_BIN = "./node_modules/.bin";
const ATTEMPTS = Infinity;
const DELAY = 500;

let electron: ChildProcess;
let vite: ChildProcess;

async function start() {
  log("Starting tasks", "Srve");

  vite = exec(`${NODE_BIN}/vite`);
  listen(vite, "vite");

  electron = await openElectron();
  listen(electron, "elec");

  // TODO: Make this restart app automatically preload or background script changed
  // watchFile("entry/preload.ts", () => console.log("preload.ts file changed, restart electron for changes"));
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
          log(`Recieved HTTP code ${resp.statusCode} from vite!`, "Srve");
        }
      }).on("error", () => {
        log(`App not available yet, retrying in ${DELAY}ms`, "Srve");
      });

      await new Promise((r) => setTimeout(r, DELAY));
    }
  });
}

async function listen(proc: ChildProcess, prefix: string) {
  proc.stdout?.on("data", (chunk) => log(chunk, prefix));
  proc.stderr?.on("data", (chunk) => log(chunk, prefix));

  proc.on("close", () => {
    log(`${prefix} was closed, stopping other tasks.`, "Srve");
    process.kill(0);
  });
}

async function log(msg: string, prefix: string) {
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
