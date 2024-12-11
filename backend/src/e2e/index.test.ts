import request from "supertest";
import { createApp } from "../createApp";
import { Express } from "express";

describe("/api/users", () => {
  let app: Express = createApp();

  beforeAll(() => {
    app = createApp();
  });

  it('should return an empty array when getting /api/users', async () => {
    const response = await request(app).get("/api/users")

    expect(response.body).toStrictEqual([])
  })
});
