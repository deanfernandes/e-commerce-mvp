const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "mail-service",
  brokers: [process.env.KAFKA_BROKER],
});
const consumer = kafka.consumer({ groupId: "mail-service-group" });

async function startConsumer(onMessage) {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-registered", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(`received msg ${message}`);
      const data = JSON.parse(message.value.toString());
      await onMessage(data);
    },
  });
}

module.exports = { startConsumer };
