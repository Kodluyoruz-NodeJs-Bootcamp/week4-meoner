//const User = require("../model/User");
import express from "express";
import User from '../model/User';
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

const router = express.Router();

router.post("/register", async (req, res) => {
  //Validate register Data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check username, İf Username has been registered, return error
  const userNameExist = await User.findOne({ userName: req.body.userName });
  if (userNameExist) return res.status(400).send("Username already exists");

  //Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    userName: req.body.userName,
    password: hashedPassword,
  });
  try {
    // Save Mongo Db
    await user.save().then((res) => console.log("res:", res));
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  //Validate login data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check Is the user registered? 
  const user = await User.findOne({ userName: req.body.userName });
  if (!user) return res.status(400).send("Username is not found");

  //Check password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Wrong password");

  //Create jwt token
  const token = jwt.sign(
    { _id: user._id, browser: req.headers["user-agent"] },
    process.env.JWT_TOKEN
  );
  
  req.session.userID = user._id;
  req.session.browser = req.headers["user-agent"];

  //Set token to cookie
  res.cookie("access_token", token, {
    httpOnly: true,
  });

  res.header("auth-token", token).send(token);
});

const authRouter = router;
export default authRouter;