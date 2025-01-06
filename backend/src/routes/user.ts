import { Router } from "express";
const router = Router();
import UserController from "../handlers/user";

router.post("/categories", UserController.updateCategories)

export default router;
