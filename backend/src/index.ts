import { createApp } from "./createApp";
import connectToDatabase from "./db/db";
import { Express } from "express";
const app = createApp();

const PORT = 3000;

function listenForRequests(): Express {
  app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
  });
  return app;
}

connectToDatabase().then(() => {
  listenForRequests();
});
