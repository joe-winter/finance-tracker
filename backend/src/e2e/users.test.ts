import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";
import User from "../models/user";
import connectToDatabase from "../db/db";
import mongoose from "mongoose";
import "../mongodb_helper"

describe("/users", () => {
  let app: Express = createApp();

  beforeEach(async () => {
    await User.deleteMany({});
  });

  beforeAll(async () => {
    app = createApp();
  });

  describe("POST with user details", () => {
    it("should return a 201 response code", async () => {
      const response = await request(app).post("/users").send({
        email: "someone@example.com",
        password: "password123",
        firstname: "Joe",
        lastname: "Winter",
      });

      expect(response.statusCode).toEqual(201);
    });

    it("should create a user", async () => {
      const response = await request(app).post("/users").send({
        email: "someone@example.com",
        password: "password123",
        firstname: "Joe",
        lastname: "Winter",
      });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(users.length).toEqual(1);
      expect(newUser.email).toEqual("someone@example.com");
    });
  });
});
