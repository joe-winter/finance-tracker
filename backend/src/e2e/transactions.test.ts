import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";
import Transaction from "../models/transaction";
import User from "../models/user";
import { generateToken } from "../lib/token";
import "../mongodb_helper";
import TransactionModel from "../models/transaction";

describe("/transactions", () => {
  let app: Express = createApp();

  beforeEach(async () => {
    await User.deleteMany({}).exec();
    await Transaction.deleteMany({}).exec();
  });
  beforeAll(async () => {
    app = createApp();
  });

  describe("POST with transaction data", () => {
    it("should return a 201 response code", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const user_id = user._id.toString();
      const token = generateToken(user_id);

      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          date: "2024-01-01",
          type: "savings",
          category: "car",
          amount: "59.99",
          description: "new tire",
          balance: "425.65",
        });
      expect(response.statusCode).toEqual(201);
    });

    it("should create a transaction", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const user_id = user._id.toString();
      const token = generateToken(user_id);
      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          date: "2024-01-01",
          type: "savings",
          category: "car",
          amount: "59.99",
          description: "new tire",
          balance: "425.65",
        });

      const transactions = await Transaction.find({}).populate("user");
      const newTransaction = transactions[transactions.length - 1];

      expect(transactions.length).toEqual(1);
      expect(newTransaction.date).toEqual(new Date("2024-01-01"));
      expect(newTransaction.type).toEqual("savings");
      expect(newTransaction.category).toEqual("car");
      expect(newTransaction.amount).toEqual(59.99);
      expect(newTransaction.description).toEqual("new tire");
      expect(newTransaction.user._id.toString()).toEqual(user_id);
    });
    it("should caluclate balanceon frst transaction", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const user_id = user._id.toString();
      const token = generateToken(user_id);
      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          date: "2024-01-01",
          type: "income",
          category: "employment",
          amount: "1000",
          description: "pay check",
        });

      const transactions = await Transaction.find({});
      const newTransaction = transactions[transactions.length - 1];

      expect(transactions.length).toEqual(1);
      expect(newTransaction.balance).toEqual(1000);
    });
    it("given old transactions, the new balance is caluclated", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const transaction = new TransactionModel({
        date: new Date("2024-01-01"),
        type: "expenses",
        category: "car",
        amount: 59.99,
        description: "new tire",
        user: user._id,
      });

      await transaction.save();
      const user_id = user._id.toString();
      const token = generateToken(user_id);
      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          date: "2024-01-02",
          type: "income",
          category: "employment",
          amount: "1000",
          description: "pay check",
        });

      const transactions = await Transaction.find({}).sort({ date: 1 });
      const newTransaction = transactions[transactions.length - 1];

      expect(transactions.length).toEqual(2);
      expect(newTransaction.balance).toEqual(940.01);
    });
    it("given old transactions, the new balance is caluclated with negative", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const transaction = new TransactionModel({
        date: new Date("2024-01-01"),
        type: "expenses",
        category: "car",
        amount: 59.99,
        description: "new tire",
        user: user._id,
      });

      await transaction.save();
      const user_id = user._id.toString();
      const token = generateToken(user_id);
      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          date: "2024-01-02",
          type: "expenses",
          category: "car",
          amount: "125",
          description: "brakes",
        });

      const transactions = await Transaction.find({}).sort({ date: 1 });
      const newTransaction = transactions[transactions.length - 1];

      expect(transactions.length).toEqual(2);
      expect(newTransaction.balance).toEqual(-184.99);
    });
    it("given a transaction with an older date recalucates future transactions", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const transactionModels = [
        // Transaction with the latest date
        new TransactionModel({
          date: new Date("2024-01-15"),
          type: "income",
          category: "salary",
          amount: 1000,
          description: "monthly salary",
          user: user._id,
        }),
        // Transaction with the earliest date
        new TransactionModel({
          date: new Date("2024-01-01"),
          type: "expenses",
          category: "car",
          amount: 59.99,
          description: "new tire",
          user: user._id,
        }),
        // Transaction with a mid-range date
        new TransactionModel({
          date: new Date("2024-01-10"),
          type: "expenses",
          category: "groceries",
          amount: 120.5,
          description: "weekly shopping",
          user: user._id,
        }),
      ];

      await transactionModels[0].save();
      await transactionModels[1].save();
      await transactionModels[2].save();

      const user_id = user._id.toString();
      const token = generateToken(user_id);
      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          date: "2024-01-02",
          type: "expenses",
          category: "car",
          amount: "125",
          description: "brakes",
        });

      const transactions = await Transaction.find({}).sort({ date: 1 });

      expect(transactions[0].balance).toEqual(-59.99); // Initial balance for the first transaction
      expect(transactions[1].balance).toEqual(-184.99); // After adding brakes (-125)
      expect(transactions[2].balance).toEqual(-305.49); // After groceries (-120.5)
      expect(transactions[3].balance).toEqual(694.51); // After salary (+1000)
    });
    it("recalucl;ates transactions given an old one", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const transactionModels = [
        // Transaction with the latest date
        new TransactionModel({
          date: new Date("2024-01-15"),
          type: "income",
          category: "salary",
          amount: 1000,
          description: "monthly salary",
          balance: 1305.15,
          user: user._id,
        }),
        // Transaction with the earliest date
        new TransactionModel({
          date: new Date("2024-01-01"),
          type: "expenses",
          category: "car",
          amount: 59.99,
          description: "new tire",
          balance: 425.65,
          user: user._id,
        }),
        // Transaction with a mid-range date
        new TransactionModel({
          date: new Date("2024-01-10"),
          type: "expenses",
          category: "groceries",
          amount: 120.5,
          description: "weekly shopping",
          balance: 305.15,
          user: user._id,
        }),
      ];

      await transactionModels[0].save();
      await transactionModels[1].save();
      await transactionModels[2].save();

      const user_id = user._id.toString();
      const token = generateToken(user_id);
      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          date: "2023-01-02",
          type: "expenses",
          category: "car",
          amount: "125",
          description: "brakes",
        });

      const transactions = await Transaction.find({}).sort({ date: 1 });

      expect(transactions[0].balance).toEqual(-125); // Initial balance for the first transaction
      expect(transactions[1].balance).toEqual(-184.99); // After adding brakes (-125)
      expect(transactions[2].balance).toEqual(-305.49); // After groceries (-120.5)
      expect(transactions[3].balance).toEqual(694.51); // After salary (+1000)
    });
    it("calculates end of day balances given transactions on the same day", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const transactionModels = [
        // January 15 transactions (multiple on same day)
        new TransactionModel({
          date: new Date("2024-01-15"),
          type: "income",
          category: "salary",
          amount: 1000,
          description: "monthly salary",
          user: user._id,
        }),
        new TransactionModel({
          date: new Date("2024-01-15"),
          type: "expenses",
          category: "utilities",
          amount: 150,
          description: "electricity bill",
          user: user._id,
        }),
        new TransactionModel({
          date: new Date("2024-01-15"),
          type: "expenses",
          category: "entertainment",
          amount: 50,
          description: "streaming service",
          user: user._id,
        }),

        // January 1 transaction
        new TransactionModel({
          date: new Date("2024-01-01"),
          type: "expenses",
          category: "car",
          amount: 59.99,
          description: "new tire",
          user: user._id,
        }),

        // January 10 transactions (multiple on same day)
        new TransactionModel({
          date: new Date("2024-01-10"),
          type: "expenses",
          category: "groceries",
          amount: 120.5,
          description: "weekly shopping",
          user: user._id,
        }),
        new TransactionModel({
          date: new Date("2024-01-10"),
          type: "income",
          category: "freelance",
          amount: 200,
          description: "freelance payment",
          user: user._id,
        }),
        new TransactionModel({
          date: new Date("2024-01-10"),
          type: "expenses",
          category: "dining",
          amount: 30,
          description: "lunch",
          user: user._id,
        }),
      ];

      // Save all transactions
      for (const transaction of transactionModels) {
        await transaction.save();
      }

      // Add new transaction via API
      const user_id = user._id.toString();
      const token = generateToken(user_id);
      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          date: "2023-01-02",
          type: "expenses",
          category: "car",
          amount: "125",
          description: "brakes",
        });

      const transactions = await Transaction.find({}).sort({ date: 1 });

      // Verify balances
      expect(transactions[0].balance).toEqual(-125); // Jan 2 - Initial brakes expense
      expect(transactions[1].balance).toEqual(-184.99); // Jan 1 - After tire (-59.99)
      expect(transactions[2].balance).toEqual(-135.49); // Jan 10 - All transactions on this day:
      // Starting from -184.99
      // -120.50 (groceries)
      // +200 (freelance)
      // -30 (lunch)
      // = -135.49 final balance
      expect(transactions[3].balance).toEqual(-135.49); // Jan 10 - Same end-of-day balance
      expect(transactions[4].balance).toEqual(-135.49); // Jan 10 - Same end-of-day balance
      expect(transactions[5].balance).toEqual(664.51); // Jan 15 - All transactions on this day:
      // Starting from -135.49
      // +1000 (salary)
      // -150 (utilities)
      // -50 (streaming)
      // = 664.51 final balance
      expect(transactions[6].balance).toEqual(664.51); // Jan 15 - Same end-of-day balance
      expect(transactions[7].balance).toEqual(664.51); // Jan 15 - Same end-of-day balance
    });
  });
  describe("GET with a valid token and user_id", () => {
    it("returns a 200 response code", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const user_id = user._id.toString();
      const token = generateToken(user_id);

      const transaction = new TransactionModel({
        date: new Date("2024-01-01"),
        type: "expenses",
        category: "car",
        amount: 59.99,
        description: "new tire",
        balance: 425.65,
        user: user._id,
      });
      await transaction.save();

      const response = await request(app)
        .get("/transactions")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(200);
    });
    it("returns all transactions for a given user", async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
      });
      await user.save();

      const user_id = user._id.toString();
      const token = generateToken(user_id);

      const transaction = new TransactionModel({
        date: new Date("2024-01-01"),
        type: "expenses",
        category: "car",
        amount: 59.99,
        description: "new tire",
        balance: 425.65,
        user: user._id,
      });
      await transaction.save();

      const response = await request(app)
        .get("/transactions")
        .set("Authorization", `Bearer ${token}`);

      const transactionResponse = response.body.transactions;

      expect(new Date(transactionResponse[0].date)).toEqual(
        new Date("2024-01-01")
      );
      expect(transactionResponse[0].type).toEqual("expenses");
      expect(transactionResponse[0].category).toEqual("car");
      expect(transactionResponse[0].amount).toEqual(59.99);
      expect(transactionResponse[0].description).toEqual("new tire");
      expect(transactionResponse[0].balance).toEqual(425.65);
    });
  });
});
