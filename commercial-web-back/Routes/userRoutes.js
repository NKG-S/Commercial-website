import express from "express";
import { createUser, getUser, logInUser, checkEmail } from "../Controllers/userController.js";

const userRouter = express.Router();

// Route to check availability (Frontend Step 1)
userRouter.post("/check-email", checkEmail);

// Route to register a new user (Frontend Step 3)
userRouter.post("/", createUser);

// Route to login
userRouter.post("/login", logInUser);

// Route to get all users (Admin)
userRouter.post("/getUser", getUser);

export default userRouter;