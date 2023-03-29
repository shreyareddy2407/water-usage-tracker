import express from "express";
const app = express();
const port = process.env.PORT || 3000;

import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import usageRoutes from "./routes/usageRoutes.js";

app.use("/api/users", usersRoutes); //get all users
app.use("/api/auth", authRoutes);
app.use("/api/usersRoutes", usersRoutes); //get current user
app.use("/api/usage", usageRoutes); //send the usage from the form

app.listen(port, () => {
  console.log("server listening to port 3000");
});
