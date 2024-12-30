import { Router } from "express";
import TransactionsController from "../handlers/transaction";
const router = Router();

router.post("/", TransactionsController.createTransaction)

export default router;
