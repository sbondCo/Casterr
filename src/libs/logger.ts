/* eslint-disable @typescript-eslint/restrict-template-expressions */
import path from "path";
import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import Paths from "./helpers/paths";

/**
 * `Message` will be used as AREA of code (eg Recorder is an area).
 */

const fileFormat = format.printf((info) => {
  const { level, message, ...meta } = info;
  // @ts-expect-error
  return `${meta.timestamp} [${level.toLocaleUpperCase()}] [${message.toLocaleUpperCase()}] ${meta[Symbol.for("splat")]
    .map((v: any) => (typeof v === "object" ? JSON.stringify(v) : v))
    .join(" ")}`;
});

const consoleFormat = format.printf((info) => {
  const { level, message, ...meta } = info;
  // @ts-expect-error
  return `${meta.timestamp} [${level.toLocaleUpperCase()}] [${message.toLocaleUpperCase()}] ${meta[Symbol.for("splat")]
    .map((v: any) => (typeof v === "object" ? JSON.stringify(v, undefined, 2) : v))
    .join("")}`;
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
      format: format.combine(format.timestamp(), fileFormat)
    })
  ]
});
