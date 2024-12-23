import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URL as string; // Replace with your MongoDB connection string
const dbName = process.env.DB_NAME;

export class DatabaseHelper {
  public static async clearDb(collectionName) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      
      // Clear existing data
      await collection.deleteMany({});
      
      console.log(`${collectionName} data has been cleared`);
    } catch (error) {
      console.error("Error clearing database database:", error);
    } finally {
      await client.close();
    }
  }
  }

