import express from "express";
const router = express();
import { CreateUser, Login, signup } from "../Controllers/authController.js";

router.get("/signup", signup);
router.post("/create-user", CreateUser);
router.post("/login", Login);

export default router;
