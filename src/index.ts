import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";

//Import Routes
import authRoute from "./routes/auth";
import homeRoute from "./routes/home";

const app = express();
const router = express.Router();

dotenv.config();
console.log("XXXXXXX", process.env);

//Connect to DB
mongoose
  .connect(process.env.DB_CONNECT as string)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log("Database Connection Error ", error);
  });

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_TOKEN,
    resave: false,
    saveUninitialized: false,
  })
);

//Routes
app.use("/api/user", authRoute);
app.use("/api/home", homeRoute);

//Start Server
app.listen(3000, () => console.log("Starting Server..."));
