import { createLogger, format, transports } from "winston";
import path from "path";

const filename = path.join(
  __dirname,
  "..",
  "..",
  "logs",
  "app-" + new Date().toISOString().replace(/[:.]/g, "-") + ".log"
);

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [new transports.Console(), new transports.File({ filename })],
});

export default logger;
