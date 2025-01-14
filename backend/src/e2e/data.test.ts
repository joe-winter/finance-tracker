import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";
import Transaction from "../models/transaction";
import User from "../models/user";
import { generateToken } from "../lib/token";
import "../mongodb_helper";
import TransactionModel from "../models/transaction";

describe("/data", () => {
  let app: Express = createApp();
  let userId: string

  beforeEach(async () => {
    await User.deleteMany({}).exec();
    await Transaction.deleteMany({}).exec();
    const user = new User({
      email: "someone@example.com",
      password: "password123",
      firstName: "joe",
      lastName: "winter",
    });
    await user.save();

    userId = user._id.toString()

    const transaction1 = new TransactionModel({
      date: new Date("2024-01-15"),
      type: "income",
      category: "salary",
      amount: 1000,
      description: "monthly salary",
      user: user._id,
    });
    await transaction1.save();

    const transaction2 = new TransactionModel({
      date: new Date("2024-01-15"),
      type: "expenses",
      category: "utilities",
      amount: 150,
      description: "electricity bill",
      user: user._id,
    });
    await transaction2.save();

    const transaction3 = new TransactionModel({
      date: new Date("2024-01-15"),
      type: "expenses",
      category: "car",
      amount: 50,
      description: "streaming service",
      user: user._id,
    });
    await transaction3.save();

    const transaction4 = new TransactionModel({
      date: new Date("2024-01-01"),
      type: "expenses",
      category: "car",
      amount: 59.99,
      description: "new tire",
      user: user._id,
    });
    await transaction4.save();

    const transaction5 = new TransactionModel({
      date: new Date("2024-01-10"),
      type: "expenses",
      category: "groceries",
      amount: 120.5,
      description: "weekly shopping",
      user: user._id,
    });
    await transaction5.save();

    const transaction6 = new TransactionModel({
      date: new Date("2024-01-10"),
      type: "income",
      category: "freelance",
      amount: 200,
      description: "freelance payment",
      user: user._id,
    });
    await transaction6.save();

    const transaction7 = new TransactionModel({
      date: new Date("2024-01-10"),
      type: "expenses",
      category: "dining",
      amount: 30,
      description: "lunch",
      user: user._id,
    });
    await transaction7.save();
  });
  beforeAll(async () => {
    app = createApp();
  });

  describe("/totals", () => {
    describe("GET with valid user and token", () => {
      it("when given no params returns total date", async () => {
        const token = generateToken(userId)

        const response = await request(app)
        .get("/data/totals")
        .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toEqual(200)

        const data = response.body.totals

        expect(data.expenses.total).toEqual(410.49)
        expect(data.income.total).toEqual(1200)

        expect(data.expenses.car).toEqual(109.99)
        expect(data.income.freelance).toEqual(200)
      })
    })
  })
});
