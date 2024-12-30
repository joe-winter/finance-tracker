import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";
import Transaction from "../models/transaction";
import User from "../models/user";
import { generateToken } from "../lib/token";
import "../mongodb_helper"

describe("/transactions", () => {
  let app: Express = createApp();

  beforeEach(async () => {
    await User.deleteMany({}).exec();
    await Transaction.deleteMany({}).exec();
    const users = await User.find();
    const transactions = await Transaction.find()
    console.log("before each /transactions", users.length, transactions.length)
  })

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
      .set("Authorisation", `Bearer ${token}`)
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
        .set("Authorisation", `Bearer ${token}`)
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
      expect(newTransaction.user._id.toString()).toEqual(user_id)
    });
  });
});
