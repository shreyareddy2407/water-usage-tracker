import User from "../models/usersModel.js";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
  res.render("login");
};

export const CreateUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.send({
        message: "User already exists",
        success: false,
        data: null,
      });
    }
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 6);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.render("dashboard", {
      existingUser: newUser,
      userId: newUser._id,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.send({
        message: "User does not exist",
        success: false,
        data: null,
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.send({
        message: "Incorrect password",
        success: false,
        data: null,
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.jwt_secret,
      {
        expiresIn: "1h",
      }
    );
    res.render("dashboard", {
      existingUser,
      userId: existingUser._id,
    });
    // res.send({
    //   message: "User logged in successfully",
    //   success: true,
    //   data: token,
    //   user: existingUser,
    // });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
};
