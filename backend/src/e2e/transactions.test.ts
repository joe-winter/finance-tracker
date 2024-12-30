import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";
import Transaction from "../models/transaction";
import connectToDatabase from "../db/db";
import mongoose from "mongoose";

describe("/transactions", () => {
  let app: Express = createApp();

  beforeEach(async () => {
    await Transaction.deleteMany({});
  });

  beforeAll(async () => {
    await connectToDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await Transaction.deleteMany({});
    await mongoose.connection.close(true);
  });

  describe("POST with transaction data", () => {
    it("should return a 201 response code", async () => {
      const response = await request(app).post("/transactions").send({
        date: "2024-01-01",
        type: "savings",
        category: "car",
        amount: "59.99",
        description: "new tire",
        balance: "425.65"
      });

      expect(response.statusCode).toEqual(201);
    });
    

    it("should create a transaction", async () => {
      await Transaction.deleteMany({});
      const response = await request(app).post("/transactions").send({
        date: "2024-01-01",
        type: "savings",
        category: "car",
        amount: "59.99",
        description: "new tire",
        balance: "425.65"
      });

      const transactions = await Transaction.find();
      const newTransaction = transactions[transactions.length - 1];
      expect(transactions.length).toEqual(1);
      expect(newTransaction.date).toEqual(new Date("2024-01-01"));
      expect(newTransaction.type).toEqual("savings");
      expect(newTransaction.category).toEqual("car");
      expect(newTransaction.amount).toEqual(59.99);
      expect(newTransaction.description).toEqual("new tire");
      expect(newTransaction.balance).toEqual(425.65);
    });
  });
});
