// routes/userRoutes.js
import express from "express";
import { createUser, getUser, logInUser } from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);        // register
userRouter.post("/login", logInUser);    // login
userRouter.post("/getUser", getUser);     // admin-only (checked in controller)

export default userRouter;
