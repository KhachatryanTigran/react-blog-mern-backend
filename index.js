import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import doten from "dotenv";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
  getLastTags,
} from "./controllers/PostController.js";
import { register, login, getMe } from "./controllers/UserController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

doten.config();

mongoose
  .connect(
    "mongodb+srv://tigran9202:077940605t@cluster1.o5ypact.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

const app = express();
app.use(express.static("./blog/build"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello Worold");
});
app.get("/posts/tags", getLastTags);
app.post("/auth/login", loginValidation, handleValidationErrors, login);

app.post(
  "/auth/register",

  registerValidation,
  handleValidationErrors,
  register
);

app.get("/auth/me", checkAuth, getMe);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  create
);
app.delete("/posts/:id", checkAuth, remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  update
);
app.post("/uploads", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.listen(3005, (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`Example app ok  `);
});
