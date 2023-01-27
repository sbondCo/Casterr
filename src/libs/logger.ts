/* eslint-disable @typescript-eslint/restrict-template-expressions */
import path from "path";
import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import Paths from "./helpers/paths";

/**
 * `Message` will be used as AREA of code (eg Recorder is an area).
 */

const formatMap = (v: any) => {
  if (v instanceof Error) {
    if (v.stack) return v.stack;
    else return v;
  } else if (typeof v === "object") {
    return JSON.stringify(v, undefined, 2);
  } else {
    return v;
  }
};

const fileFormat = format.printf((info) => {
  const { level, message, ...meta } = info;
  // @ts-expect-error Keeps saying cant use type 'symbol' as an index type.. not sure why
  return `${meta.timestamp} [${level.toLocaleUpperCase()}] [${message.toLocaleUpperCase()}] ${meta[Symbol.for("splat")]
    .map(formatMap)
    .join(" ")}`;
});

const consoleFormat = format.printf((info) => {
  const { level, message, ...meta } = info;
  // @ts-expect-error Keeps saying cant use type 'symbol' as an index type.. not sure why
  return `${meta.timestamp} [${level.toLocaleUpperCase()}] [${message.toLocaleUpperCase()}] ${meta[Symbol.for("splat")]
    .map(formatMap)
    .join(" ")}`;
});

export const logger = createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(format.timestamp({ format: "HH:MM:SS" }), consoleFormat)
    }),
    new DailyRotateFile({
      filename: path.join(Paths.logsPath, "casterr-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "2d",
      maxSize: "30m",
      format: format.combine(format.timestamp(), fileFormat)
    })
  ]
});
