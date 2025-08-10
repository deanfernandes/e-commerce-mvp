import { createLogger, format, transports } from "winston";

const logFileName =
  "logs/app-" + new Date().toISOString().replace(/[:.]/g, "-") + ".log";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFileName }),
  ],
});

export default logger;
