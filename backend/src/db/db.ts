import mongoose from "mongoose";

async function connectToDatabase() {
  const mongoDbUrl = process.env.MONGODB_URL as string;

  if (!mongoDbUrl) {
    console.error(
      "No MongoDB url provided. Make sure there is a MONGODB_URL environment variable set."
    );
    throw new Error("No connection string provided");
  }

  try {
    await mongoose.connect(mongoDbUrl)
    console.log("Connected to MongoDB")
  } catch (err) {
    console.log(err)
  }

  await mongoose.connect(mongoDbUrl);

  if (process.env.NODE_ENV !== "test") {
    console.log("Successfully connected to MongoDB");
  }
}

export default connectToDatabase