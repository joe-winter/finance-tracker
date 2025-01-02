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
    const users = await User.find({});
    const transactions = await Transaction.find({});
    console.log("before each /transactions", users.length, transactions.length);
  });
  afterEach(async () => {
    await User.deleteMany({}).exec();
    await Transaction.deleteMany({}).exec();
    const users = await User.find({});
    const transactions = await Transaction.find({});
    console.log("before each /transactions", users.length, transactions.length);
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
      expect(newTransaction.balance).toEqual(425.65);
      expect(newTransaction.user._id.toString()).toEqual(user_id);
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
      console.log("response", transactionResponse.transactions)

      expect(new Date(transactionResponse[0].date)).toEqual(new Date("2024-01-01"));
      expect(transactionResponse[0].type).toEqual("expenses");
      expect(transactionResponse[0].category).toEqual("car");
      expect(transactionResponse[0].amount).toEqual(59.99);
      expect(transactionResponse[0].description).toEqual("new tire");
      expect(transactionResponse[0].balance).toEqual(425.65);
    });
  });
});
