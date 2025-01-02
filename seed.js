import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URL; // Replace with your MongoDB connection string
const dbName = process.env.DB_NAME;

async function seedDatabase(collectionName, data) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to database")
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Clear existing data
    await collection.deleteMany({});
    
    // Insert new data
    await collection.insertMany(data);
    
    console.log(`Seeded ${data.length} items into ${collectionName}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

async function getData(collectionName) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to database")
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Get exisiting data
    const res = await collection.find().toArray();
    
    return res
  } catch (error) {
    console.error("Error getting data", error);
  } finally {
    await client.close();
  }
}

const users = [
  {
    email: "johndoe@email.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
  },
  {
    email: "test",
    password: "1234",
    firstName: "Joe",
    lastName: "Winter",
  }
]


await seedDatabase("users", users)
const data = await getData("users")


const transactions = [
  {
    date: new Date("2024-01-01"),
    type: "expense",
    category: "Groceries",
    amount: 85.50,
    description: "Weekly grocery shopping at Whole Foods",
    balance: 2914.50,
    user: data[0]._id
  },
  {
    date: new Date("2024-01-02"),
    type: "income",
    category: "Salary",
    amount: 3000.00,
    description: "Monthly salary deposit",
    balance: 5914.50,
    user: data[0]._id
  },
  {
    date: new Date("2024-01-03"),
    type: "expense",
    category: "Bills",
    amount: 150.00,
    description: "Electricity bill payment",
    balance: 5764.50,
    user: data[0]._id
  },
  {
    date: new Date("2024-01-03"),
    type: "expense",
    category: "Transportation",
    amount: 45.00,
    description: "Gas station fill-up",
    balance: 5719.50,
    user: data[0]._id
  },
  {
    date: new Date("2024-01-01"),
    type: "expense",
    category: "Entertainment",
    amount: 65.00,
    description: "Movie tickets and dinner",
    balance: 1935.00,
    user: data[1]._id
  },
  {
    date: new Date("2024-01-02"),
    type: "income",
    category: "Freelance",
    amount: 500.00,
    description: "Web development project payment",
    balance: 2435.00,
    user: data[1]._id
  },
  {
    date: new Date("2024-01-03"),
    type: "expense",
    category: "Shopping",
    amount: 120.00,
    description: "New clothes from H&M",
    balance: 2315.00,
    user: data[1]._id
  },
  {
    date: new Date("2024-01-03"),
    type: "expense",
    category: "Bills",
    amount: 80.00,
    description: "Internet bill",
    balance: 2235.00,
    user: data[1]._id
  }
];

await seedDatabase("transactions", transactions)



