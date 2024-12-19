import { Router } from "express";
const router = Router();
import UsersController from "../handlers/users";

router.post("/", UsersController.createUser)

export default router;
