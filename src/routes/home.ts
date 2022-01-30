//const router = require("express").Router();
import express from "express";
import {User} from '../entity/User';
const verify = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", verify, async (req, res) => {
  const user = await User.findOne({ id: req.user });
  res.send(user);
});

const homeRouter = router;
export default homeRouter;