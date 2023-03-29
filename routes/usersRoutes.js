import { Router } from "express";
const router = Router();
import { getAllClients, GetUserById } from "../Controllers/usersController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

router.get("/get-all-users", authMiddleware, getAllClients);
router.get("/:userId", GetUserById);

export default router;
