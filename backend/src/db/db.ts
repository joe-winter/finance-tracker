import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectToDatabase() {
  const mongoDbUrl = process.env.MONGODB_URL;

  if (!mongoDbUrl) {
    console.error(
      "No MongoDB url provided. Make sure there is a MONGODB_URL environment variable set."
    );
    throw new Error("No connection string provided");
  }

  try {
    await mongoose.connect(mongoDbUrl);
  } catch (err) {
    console.log(err);
  }

  await mongoose.connect(mongoDbUrl);

  if (process.env.NODE_ENV !== "test") {
    console.log("Successfully connected to MongoDB");
  }
}

export default connectToDatabase;
