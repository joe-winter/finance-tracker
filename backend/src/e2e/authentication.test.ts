import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";
import User from "../models/user";
import connectToDatabase from "../db/db";
import mongoose from "mongoose";

describe("/tokens", () => {
  let app: Express = createApp();

  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({
      email: "someone@example.com",
      password: "password123",
      firstName: "Joe",
      lastName: "Winter",
    });
    await user.save();
  });

  beforeAll(async () => {
    await connectToDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
  });

  it("should return token given valid details", async () => {
    const response = await request(app)
      .post("/tokens")
      .send({ email: "someone@example.com", password: "password123" });

    expect(response.status).toEqual(201);
    expect(response.body.token).not.toEqual(undefined);
    expect(response.body.message).toEqual("OK");
  });
  it("doesn't return a token when the user doesn't exist", async () => {
    const response = await request(app)
      .post("/tokens")
      .send({ email: "non-existent@test.com", password: "password123" });

    expect(response.status).toEqual(401);
    expect(response.body.token).toEqual(undefined);
    expect(response.body.message).toEqual("User not found");
  });
  test("doesn't return a token when the wrong password is given", async () => {
    const response = await request(app)
      .post("/tokens")
      .send({ email: "someone@example.com", password: "1234" });

    expect(response.status).toEqual(401);
    expect(response.body.token).toEqual(undefined);
    expect(response.body.message).toEqual("Password incorrect");
  });
});
