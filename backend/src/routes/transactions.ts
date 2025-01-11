import { Router } from "express";
import TransactionsController from "../handlers/transaction";
const router = Router();

router.post("/", TransactionsController.create)
router.get("/", TransactionsController.getByUser)
router.delete("/:id", TransactionsController.deleteById)

export default router;
