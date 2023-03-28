import express from "express";
const router = express();
import { CreateUser } from "../Controllers/authController.js";

router.post("/create-user", CreateUser);

export default router;
