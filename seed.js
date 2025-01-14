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
        "transportation",
        "education",
        "groceries",
        "travel",
      ],
      income: ["freelance", "salary", "investment"],
      savings: [
        "emergency fund",
        "travel fund",
        "investment",
        "retirement fund",
      ],
    },
  },
];

await seedDatabase("users", users);
const data = await getData("users");

const transactions = [
  // Existing transactions
  {
    date: new Date("2025-01-01"),
    type: "expenses",
    category: "entertainment",
    amount: 65.0,
    description: "Movie tickets and dinner",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-02"),
    type: "income",
    category: "freelance",
    amount: 500.0,
    description: "Web development project payment",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-03"),
    type: "expenses",
    category: "shopping",
    amount: 120.0,
    description: "New clothes from H&M",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-03"),
    type: "expenses",
    category: "bills",
    amount: 80.0,
    description: "Internet bill",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-04"),
    type: "expenses",
    category: "dining",
    amount: 50.0,
    description: "Dinner at a local restaurant",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-05"),
    type: "savings",
    category: "emergency fund",
    amount: 300.0,
    description: "Transferred to emergency savings",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-06"),
    type: "savings",
    category: "travel fund",
    amount: 200.0,
    description: "Set aside for vacation savings",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-07"),
    type: "expenses",
    category: "health",
    amount: 100.0,
    description: "Pharmacy purchase",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-08"),
    type: "income",
    category: "salary",
    amount: 1500.0,
    description: "Monthly salary payment",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-09"),
    type: "expenses",
    category: "utilities",
    amount: 90.0,
    description: "Water bill payment",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-10"),
    type: "savings",
    category: "investment",
    amount: 400.0,
    description: "Contribution to investment account",
    user: data[0]._id,
  },
  // Additional transactions
  {
    date: new Date("2025-01-11"),
    type: "expenses",
    category: "transportation",
    amount: 60.0,
    description: "Monthly bus pass",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-12"),
    type: "expenses",
    category: "education",
    amount: 200.0,
    description: "Online course fee",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-13"),
    type: "expenses",
    category: "groceries",
    amount: 150.0,
    description: "Weekly grocery shopping",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-14"),
    type: "expenses",
    category: "travel",
    amount: 500.0,
    description: "Flight tickets for vacation",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-15"),
    type: "income",
    category: "investment",
    amount: 200.0,
    description: "Dividends from stock investments",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-16"),
    type: "savings",
    category: "retirement fund",
    amount: 350.0,
    description: "Contribution to retirement savings",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-17"),
    type: "expenses",
    category: "entertainment",
    amount: 75.0,
    description: "Concert tickets",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-18"),
    type: "income",
    category: "freelance",
    amount: 600.0,
    description: "Graphic design project payment",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-19"),
    type: "expenses",
    category: "shopping",
    amount: 200.0,
    description: "Electronics purchase",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-20"),
    type: "savings",
    category: "travel fund",
    amount: 250.0,
    description: "Added to travel savings",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-11"),
    type: "expenses",
    category: "transportation",
    amount: 50.0,
    description: "Monthly subway pass",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-12"),
    type: "expenses",
    category: "education",
    amount: 200.0,
    description: "Online course subscription",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-13"),
    type: "expenses",
    category: "groceries",
    amount: 150.0,
    description: "Weekly grocery shopping",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-14"),
    type: "expenses",
    category: "travel",
    amount: 500.0,
    description: "Flight tickets for vacation",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-15"),
    type: "income",
    category: "salary",
    amount: 2000.0,
    description: "Monthly salary",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-16"),
    type: "income",
    category: "investment",
    amount: 100.0,
    description: "Dividend from stocks",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-17"),
    type: "savings",
    category: "retirement fund",
    amount: 500.0,
    description: "Monthly retirement savings",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-18"),
    type: "savings",
    category: "emergency fund",
    amount: 200.0,
    description: "Emergency fund contribution",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-19"),
    type: "savings",
    category: "travel fund",
    amount: 100.0,
    description: "Vacation savings",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-20"),
    type: "savings",
    category: "investment",
    amount: 300.0,
    description: "Investment account deposit",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-01"),
    type: "expenses",
    category: "entertainment",
    amount: 65.0,
    description: "Movie tickets and dinner",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-02"),
    type: "income",
    category: "freelance",
    amount: 500.0,
    description: "Web development project payment",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-03"),
    type: "expenses",
    category: "shopping",
    amount: 120.0,
    description: "New clothes from H&M",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-03"),
    type: "expenses",
    category: "bills",
    amount: 80.0,
    description: "Internet bill",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-04"),
    type: "expenses",
    category: "dining",
    amount: 50.0,
    description: "Dinner at a local restaurant",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-05"),
    type: "savings",
    category: "emergency fund",
    amount: 300.0,
    description: "Transferred to emergency savings",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-06"),
    type: "savings",
    category: "travel fund",
    amount: 200.0,
    description: "Set aside for vacation savings",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-07"),
    type: "expenses",
    category: "health",
    amount: 100.0,
    description: "Pharmacy purchase",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-08"),
    type: "income",
    category: "gift",
    amount: 150.0,
    description: "Birthday gift from family",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-09"),
    type: "expenses",
    category: "utilities",
    amount: 90.0,
    description: "Water bill payment",
    user: data[0]._id,
  },
  {
    date: new Date("2025-01-10"),
    type: "savings",
    category: "investment",
    amount: 400.0,
    description: "Contribution to investment account",
    user: data[0]._id,
  },

  // February 2025
  {
    date: new Date("2025-02-01"),
    type: "expenses",
    category: "entertainment",
    amount: 45.0,
    description: "Concert tickets",
    user: data[0]._id,
  },
  {
    date: new Date("2025-02-02"),
    type: "income",
    category: "freelance",
    amount: 600.0,
    description: "Freelance web design project",
    user: data[0]._id,
  },
  {
    date: new Date("2025-02-03"),
    type: "expenses",
    category: "shopping",
    amount: 150.0,
    description: "New winter coat",
    user: data[0]._id,
  },
  {
    date: new Date("2025-02-04"),
    type: "expenses",
    category: "bills",
    amount: 100.0,
    description: "Electricity bill",
    user: data[0]._id,
  },
  {
    date: new Date("2025-02-05"),
    type: "expenses",
    category: "dining",
    amount: 60.0,
    description: "Dinner with friends",
    user: data[0]._id,
  },
  {
    date: new Date("2025-02-06"),
    type: "savings",
    category: "emergency fund",
    amount: 200.0,
    description: "Monthly emergency fund contribution",
    user: data[0]._id,
  },
  {
    date: new Date("2025-02-07"),
    type: "savings",
    category: "travel fund",
    amount: 150.0,
    description: "Vacation savings",
    user: data[0]._id,
  },
  {
    date: new Date("2025-02-08"),
    type: "savings",
    category: "investment",
    amount: 250.0,
    description: "Stock market investment",
    user: data[0]._id,
  },

  // March 2025
  {
    date: new Date("2025-03-01"),
    type: "expenses",
    category: "health",
    amount: 80.0,
    description: "Gym membership",
    user: data[0]._id,
  },
  {
    date: new Date("2025-03-02"),
    type: "income",
    category: "gift",
    amount: 100.0,
    description: "Birthday gift from parents",
    user: data[0]._id,
  },
  {
    date: new Date("2025-03-03"),
    type: "expenses",
    category: "utilities",
    amount: 120.0,
    description: "Internet and phone bill",
    user: data[0]._id,
  },
  {
    date: new Date("2025-03-04"),
    type: "expenses",
    category: "entertainment",
    amount: 30.0,
    description: "Streaming service subscription",
    user: data[0]._id,
  },
  {
    date: new Date("2025-03-05"),
    type: "expenses",
    category: "shopping",
    amount: 200.0,
    description: "Electronics purchase",
    user: data[0]._id,
  },
  {
    date: new Date("2025-03-06"),
    type: "savings",
    category: "emergency fund",
    amount: 300.0,
    description: "Emergency fund contribution",
    user: data[0]._id,
  },
  {
    date: new Date("2025-03-07"),
    type: "savings",
    category: "travel fund",
    amount: 200.0,
    description: "Travel savings",
    user: data[0]._id,
  },
];

await seedDatabase("transactions", transactions);
