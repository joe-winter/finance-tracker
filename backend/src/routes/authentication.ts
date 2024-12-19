import { Router } from "express";
import AuthenticationHandler from "../handlers/authentication";

const router = Router()

router.post("/", AuthenticationHandler.createToken)

export default router