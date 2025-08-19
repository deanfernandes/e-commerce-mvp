import { createClient } from "redis";
import logger from "./logger-service";

const client = createClient({
  url: `redis://redis-db`,
});

client.on("error", (err) => {
  logger.error("Redis Client Error:", err);
});

client.on("connect", () => {
  logger.info(
    `Connected to Redis @ ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  );
});

client.on("disconnect", () => {
  logger.warn("Redis client disconnected");
});

(async (): Promise<void> => {
  try {
    await client.connect();
  } catch (err) {
    logger.error(
      `Failed to connect to Redis @ ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}:`,
      err
    );
  }
})();

export default client;
