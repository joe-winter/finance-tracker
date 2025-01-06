import { Router } from "express";
const router = Router();
import UserController from "../handlers/user";

router.post("/categories", UserController.updateCategories)
router.get("/", UserController.getNonSensitiveData)

export default router;
