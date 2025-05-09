import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import router from "./routes.js";
import mongoose from "mongoose";
import logger from "./utils/logger.js";
import cron from "node-cron"
import FileData from "./models/FileData.js";

configDotenv();

mongoose.connect(process.env.MONGODB_URI).then(() => {
  logger.info('MongoDB connected')
})

const app = express();
app.use(express.json());
app.use(cors())
app.use(router)

app.get("/", (_, res) => {
  res.send("test");
})

const port = process.env.PORT || 5000;
app.listen(port,  () => {
  logger.info(`Server started at port: ${port}`)
});

cron.schedule("0 0 * * *", async() => {
  try {
    logger.info("Job started for clearing DB collection");
    const deleteData = await FileData.deleteMany({});
    if(deleteData && deleteData.deletedCount === 0) {
      logger.info("No data found or data alreay cleared")
      return;
    }
    if (deleteData && deleteData.deletedCount > 0) {
      logger.info("Data cleared successfully")
    } else {
      logger.info("Data not cleared successfully")
      throw new Error("Data not cleared")
    }
  } catch(e) {
    logger.error(`${e.message}`);
  }
})