import { Router } from "express";
const router = Router();
import UsersController from "../handlers/users";

router.get("/:id", UsersController.getUserById)

router.post("/", UsersController.createUser)

export default router;
