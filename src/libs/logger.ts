/* eslint-disable @typescript-eslint/restrict-template-expressions */
import path from "path";
import { createLogger, transports, format } from "winston";
import PathHelper from "./helpers/pathHelper";

/**
 * `Message` will be used as AREA of code (eg Recorder is an area).
 */

const fformat = format.printf((info) => {
  const { level, message, ...meta } = info;
  return `${meta.timestamp} [${level.toLocaleUpperCase()}] [${message.toLocaleUpperCase()}] ${meta[Symbol.for("splat")]
    .map((v: any) => (typeof v === "object" ? JSON.stringify(v) : v))
    .join(" ")}`;
});

export const logger = createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(format.colorize({ all: true }), format.timestamp(), format.simple())
    }),
    new transports.File({
      level: "debug",
      filename: path.join(PathHelper.logsPath, "debug.log"),
      format: format.combine(format.timestamp(), fformat)
    })
  ]
});
