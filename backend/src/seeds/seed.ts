import mongoose from "mongoose";
import User from "../models/user";

async function connectToDatabase() {
  const mongoDbUrl = "mongodb://0.0.0.0/acebook";
  if (!mongoDbUrl) {
    console.error(
      "No MongoDB url provided. Make sure there is a MONGODB_URL environment variable set. See the README for more details."
    );
    throw new Error("No connection string provided");
  }
  await mongoose.connect(mongoDbUrl);
  console.log("Connected to database");
}