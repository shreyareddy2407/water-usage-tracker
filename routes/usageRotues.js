import { Router } from "express";
const router = Router();
import {
  AddUsage,
  getDailyUsage,
  getMonthlyUsage,
  setMaxUsage,
  getMaxUsage,
  GetUsage,
} from "../Controllers/usageController.js";

//saving the usage from usage form into db
router.post("/water/:userId", AddUsage);
router.get("/dashboard", GetUsage);
router.get("/daily/:userId", getDailyUsage);
router.get("/monthly/:userId", getMonthlyUsage);
router.post("/maxUsage/:userId", setMaxUsage);
router.get("/maxUsage/:userId", getMaxUsage);

export default router;
