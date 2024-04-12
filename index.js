const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

// 連結 MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("成功連結到 mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
); // course route 應該被 jwt 保護
// 如果 request header 內部沒有 jwt，則 request 就會被視為 unauthorized

// 只有登入系統的人，才能夠去新增課程或是註冊課程
// jwt

app.listen(8080, () => {
  console.log("後端伺服器聆聽在 port 8080...");
});
