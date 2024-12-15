import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";
import User from "../models/user";

describe("/users", () => {
  let app: Express = createApp();

  beforeAll(() => {
    app = createApp();
  });

  describe("POST with user details", () => {
    it("should return a 201 response code", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          email: "someone@example.com",
          password: "password123",
          firstname: "Joe",
          lastname: "Winter",
        });
        
        expect(response.statusCode).toEqual(201)
      });
      
      it("should create a user", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          email: "someone@example.com",
          password: "password123",
          firstname: "Joe",
          lastname: "Winter",
        });

      const users = await User.find()
      const newUser = users[users.length - 1]
      expect(newUser.email).toEqual("someone@example.com")
    })
  });
});
