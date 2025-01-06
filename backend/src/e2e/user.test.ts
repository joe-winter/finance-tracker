import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";
import User from "../models/user";
import "../mongodb_helper";

describe("/users", () => {
  let app: Express = createApp();

  beforeEach(async () => {
    await User.deleteMany({}).exec();
    const user = new User({
      email: "someone@example.com",
      password: "password123",
      firstName: "joe",
      lastName: "winter",
      categories: {
        expenses: [],
        income: [],
        savings: [],
      },
    });
  });

  beforeAll(async () => {
    app = createApp();
  });

  describe("POST with user details", () => {
    it("should return a 200 response code", async () => {
      const response = await request(app)
        .post("/user/categories")
        .send({
          expenses: ["rent", "groceries"],
          income: ["salary", "bonus"],
          savings: ["emergency fund", "retirement"],
        });

      expect(response.statusCode).toEqual(200);
    });
    it("should updatye user categories", async () => {
      const response = await request(app)
        .post("/user/categories")
        .send({
          expenses: ["rent", "groceries"],
          income: ["salary", "bonus"],
          savings: ["emergency fund", "retirement"],
        });

      const users = await User.find({});
      const user = users[0];
      expect(response.statusCode).toEqual(201);
      expect(users.length).toEqual(1);
      expect(user.email).toEqual("someone@example.com");
      expect(user.categories).toMatchObject({
        expenses: ["rent", "groceries"],
        income: ["salary", "bonus"],
        savings: ["emergency fund", "retirement"],
      });
    });
  });
});
