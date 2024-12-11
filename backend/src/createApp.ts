import express from "express";
import userRouter from "./routes/users";

export function createApp() {
  const app = express();

  app.use("/api/users", userRouter);

  return app;
}
