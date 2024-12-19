import express from "express";
import userRouter from "./routes/users";
import authenticationRouter from "./routes/authentication"
import bodyParser from "body-parser";
import cors from "cors";
export function createApp() {
  const app = express();

  app.use(bodyParser.json())
  app.use(cors())
  app.use("/users", userRouter);
  app.use("/tokens", authenticationRouter)


  return app;
}

