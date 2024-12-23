import { Router } from "express";
const router = Router();
import UsersController from "../handlers/users";
import AuthenticationHandler from "../handlers/authentication";

router.post("/", UsersController.createUser, AuthenticationHandler.createToken)

export default router;
