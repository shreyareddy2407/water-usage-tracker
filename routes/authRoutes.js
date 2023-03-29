import express from "express";
const router = express();

// import authController from "../Controllers/authController.js";

// const authInstance = new authController();
import {
  CreateUser,
  Login,
  ResetPassword,
  UpdatePassword,
  signup,
  Logout,
} from "../Controllers/authController.js";

router.get("/signup", signup);
router.post("/create-user", CreateUser);
router.post("/login", Login);
router.post("/requestPasswordReset", ResetPassword);
router.post("/resetPassword/:userId/:resetString", UpdatePassword);
router.get("/logout", Logout);

export default router;
