import mongoose from "mongoose";

import * as dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.mongo_url);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("MongoDb connection successful");
});

db.on("error", () => {
  console.log("MongoDb connection failed");
});

export default db;
