import { Router } from "express";
import DataController from "../handlers/data";
const router = Router();

router.get("/totals", DataController.totals)

export default router;
