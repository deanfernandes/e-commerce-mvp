import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "mail-service",
  brokers: [process.env.KAFKA_BROKER],
});
const consumer = kafka.consumer({ groupId: "mail-service-group" });

export async function startConsumer(onMessage) {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-registered", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      await onMessage(data);
    },
  });
}
