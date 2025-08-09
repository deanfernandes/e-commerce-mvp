import app from "./app";
import dotenv from "dotenv";
import logger from "./services/logger-service";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`server running http://localhost:${PORT}`);
});
