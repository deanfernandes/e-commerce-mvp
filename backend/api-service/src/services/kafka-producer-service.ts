import { Kafka } from "kafkajs";
import logger from "./logger-service";

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER!],
});

export const producer = kafka.producer();

(async () => {
  try {
    await producer.connect();
    logger.info(`Connected kafka producer`);
  } catch (err) {
    logger.error(`Failed to connect to kafka server: ${err}`);
  }
})();
