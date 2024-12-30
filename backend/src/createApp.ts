import express from "express";
import userRouter from "./routes/users";
import authenticationRouter from "./routes/authentication"
import transactionsRouter from "./routes/transactions"
import bodyParser from "body-parser";
import cors from "cors";
import { tokenChecker } from "./middleware/tokenChecker";
export function createApp() {
  const app = express();

  app.use(bodyParser.json())
  app.use(cors())

  // routes
  app.use("/users", userRouter);
  app.use("/tokens", authenticationRouter)
  app.use("/transactions", tokenChecker, transactionsRouter)


  return app;
}

