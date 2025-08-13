require("dotenv").config();
const { startConsumer } = require("./kafkaConsumer");
const { sendConfirmEmail } = require("./mailClient");

async function main() {
  await startConsumer(async (userEvent) => {
    console.log(`Received user event for: ${userEvent.email}`);

    try {
      await sendConfirmEmail(userEvent.email, userEvent.token);
      console.log(`Confirmation email sent to ${userEvent.email}`);
    } catch (err) {
      console.error(
        `Failed to send confirmation email to ${userEvent.email}:`,
        err
      );
    }
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
