import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URL; // Replace with your MongoDB connection string
const dbName = process.env.DB_NAME;

async function seedDatabase(collectionName, data) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to database");
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
    console.log("Connected to database");
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Get existing data
    const res = await collection.find().toArray();

    return res;
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
    categories: {
      expenses: ["groceries", "bills", "transportation"],
      income: ["salary"],
      savings: [],
    },
  },
  {
    email: "test",
    password: "1234",
    firstName: "Joe",
    lastName: "Winter",
    categories: {
      expenses: [
        "entertainment",
        "shopping",
        "bills",
        "dining",
        "health",
        "utilities",
      ],
      income: ["freelance", "gift"],
      savings: ["emergency fund", "travel fund", "investment"],
    },
  },
];

await seedDatabase("users", users);
const data = await getData("users");

const transactions = [
  {
    date: new Date("2025-01-01"),
    type: "expenses",
    category: "groceries",
    amount: 85.5,
    description: "Weekly grocery shopping at Whole Foods",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-02"),
    type: "income",
    category: "salary",
    amount: 3000.0,
    description: "Monthly salary deposit",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-03"),
    type: "expenses",
    category: "bills",
    amount: 150.0,
    description: "Electricity bill payment",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-03"),
    type: "expenses",
    category: "transportation",
    amount: 45.0,
    description: "Gas station fill-up",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-01"),
    type: "expenses",
    category: "entertainment",
    amount: 65.0,
    description: "Movie tickets and dinner",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-02"),
    type: "income",
    category: "freelance",
    amount: 500.0,
    description: "Web development project payment",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-03"),
    type: "expenses",
    category: "shopping",
    amount: 120.0,
    description: "New clothes from H&M",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-03"),
    type: "expenses",
    category: "bills",
    amount: 80.0,
    description: "Internet bill",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-04"),
    type: "expenses",
    category: "dining",
    amount: 50.0,
    description: "Dinner at a local restaurant",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-05"),
    type: "savings",
    category: "emergency fund",
    amount: 300.0,
    description: "Transferred to emergency savings",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-06"),
    type: "savings",
    category: "travel fund",
    amount: 200.0,
    description: "Set aside for vacation savings",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-07"),
    type: "expenses",
    category: "health",
    amount: 100.0,
    description: "Pharmacy purchase",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-08"),
    type: "income",
    category: "gift",
    amount: 150.0,
    description: "Birthday gift from family",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-09"),
    type: "expenses",
    category: "utilities",
    amount: 90.0,
    description: "Water bill payment",
    user: data[1]._id,
  },
  {
    date: new Date("2025-01-10"),
    type: "savings",
    category: "investment",
    amount: 400.0,
    description: "Contribution to investment account",
    user: data[1]._id,
  },
];

await seedDatabase("transactions", transactions);
