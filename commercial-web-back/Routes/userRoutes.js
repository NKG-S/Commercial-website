// commercial-web-back/Routes/userRoutes.js
import express from "express";
import { 
    createUser, 
    getUser, 
    logInUser, 
    checkEmail, 
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    addToCart,
    getCart,
    removeFromCart
} from "../Controllers/userController.js"

// Middleware to ensure user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - Please log in" });
    }
    next();
};

const userRouter = express.Router()

// Public Routes
userRouter.post("/check-email", checkEmail)
userRouter.post("/", createUser)
userRouter.post("/login", logInUser)
userRouter.post("/getUser", getUser)

// Protected Routes (Cart) - MUST have authentication
userRouter.post("/cart/:productId", requireAuth, addToCart);
userRouter.get("/cart", requireAuth, getCart);
userRouter.delete("/cart/:productId", requireAuth, removeFromCart);

// Protected Routes (Profile)
userRouter.get("/profile", requireAuth, getUserProfile)
userRouter.put("/profile", requireAuth, updateUserProfile)
userRouter.delete("/profile", requireAuth, deleteUserProfile)

export default userRouter;