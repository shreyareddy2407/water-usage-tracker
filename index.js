import express from "express";
const app = express();
const port = process.env.PORT || 3000;
// import dbConfig from "./config/dbConfig.js";

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "views");

// parse application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from "./routes/authRoutes.js";
// import usersRoutes from "./routes/usersRoutes.js";
import usageRoutes from "./routes/usageRoutes.js";

// app.use("/api/users", usersRoutes); //get all users
app.use("/api/auth", authRoutes);
// app.use("/api/usersRoutes", usersRoutes); //get current user
app.use("/api/usage", usageRoutes); //send the usage from the form
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log("server listening to port 3000");
});
