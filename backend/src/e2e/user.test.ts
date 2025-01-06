import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";
import User from "../models/user";
import "../mongodb_helper";
import { generateToken } from "../lib/token";

describe("/user", () => {
  let app: Express = createApp();
  let token: string;

  beforeEach(async () => {
    await User.deleteMany({}).exec();
  });

  beforeAll(async () => {
    app = createApp();
  });
  describe("/", () => {
    beforeEach(async () => {
      const user = new User({
        email: "someone@example.com",
        password: "password123",
        firstName: "joe",
        lastName: "winter",
        categories: {
          expenses: ["car", "food", "bills"],
          income: ["freelance", "employment"],
          savings: ["savings", "fund"],
        },
      });
      await user.save();
      token = generateToken(user._id.toString());
    });
    describe("GET with valid token", () => {
      it("should return a 200 response code", async () => {
        const response = await request(app)
          .get("/user")
          .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toEqual(200);
      });
      it("should get non sensivte information", async () => {
        const response = await request(app)
          .get("/user")
          .set("Authorization", `Bearer ${token}`);

        const user = response.body.user;
        expect(response.statusCode).toEqual(200);
        expect(user.email).toEqual("someone@example.com");
        expect(user.firstName).toEqual("joe");
        expect(user.lastName).toEqual("winter");
        expect(user.categories).toMatchObject({
          expenses: ["car", "food", "bills"],
          income: ["freelance", "employment"],
          savings: ["savings", "fund"],
        });
        expect(user.password).toBeUndefined()
      });
    });
  });

  describe("/categories", () => {
    beforeEach(async () => {
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
      await user.save();
      token = generateToken(user._id.toString());
    });
    describe("POST with user details", () => {
      it("should return a 200 response code", async () => {
        const response = await request(app)
          .post("/user/categories")
          .set("Authorization", `Bearer ${token}`)
          .send({
            expenses: ["rent", "groceries"],
            income: ["salary", "bonus"],
            savings: ["emergency fund", "retirement"],
          });

        expect(response.statusCode).toEqual(200);
      });
      it("should update user categories", async () => {
        const response = await request(app)
          .post("/user/categories")
          .set("Authorization", `Bearer ${token}`)
          .send({
            expenses: ["rent", "groceries"],
            income: ["salary", "bonus"],
            savings: ["emergency fund", "retirement"],
          });

        const users = await User.find({});
        const user = users[0];
        expect(response.statusCode).toEqual(200);
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
});
