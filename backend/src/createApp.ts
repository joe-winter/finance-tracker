import express from "express";
import userRouter from "./routes/users";
import bodyParser from "body-parser";

export function createApp() {
  const app = express();

  app.use(bodyParser.json())

  app.use("/users", userRouter);

  return app;
}
