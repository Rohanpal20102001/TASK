const express = require("express");
const { signUp, signIn } = require("../Controller/user");
const { auth } = require("../Middleware/auth");
const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);

module.exports = userRouter;
