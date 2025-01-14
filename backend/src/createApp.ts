import express from "express";
import usersRouter from "./routes/users";
import authenticationRouter from "./routes/authentication"
import transactionsRouter from "./routes/transactions"
import userRouter from "./routes/user"
import dataRouter from "./routes/data"
import bodyParser from "body-parser";
import cors from "cors";
import { tokenChecker } from "./middleware/tokenChecker";
export function createApp() {
  const app = express();

  app.use(bodyParser.json())
  app.use(cors())

  // routes
  app.use("/users", usersRouter);
  app.use("/tokens", authenticationRouter)
  app.use("/transactions", tokenChecker, transactionsRouter)
  app.use("/user", tokenChecker, userRouter)
  app.use("/data", tokenChecker, dataRouter)


  return app;
}

