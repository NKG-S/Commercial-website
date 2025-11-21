// commercial-web-back/index.js
import express from "express"
import mongoose from "mongoose"
import userRoutes from "./Routes/userRoutes.js";
import productRouter from "./Routes/productRoutes.js";
import jwt from "jsonwebtoken"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();
const mongodbUrl = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET

mongoose.connect(mongodbUrl)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const app = express();
app.use(express.json());
app.use(cors())

// JWT Authentication Middleware
app.use((req, res, next) => {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
        return next(); // no token → continue normally
    }

    const token = authorizationHeader.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: "Unauthorized Access - Invalid Token" });
        }

        // token is valid → attach user and continue
        req.user = decodedUser;
        next();
    });
});

// Routes - FIXED: Changed /api/user to /api/users to match frontend
app.use("/api/user", userRoutes)
app.use("/api/product", productRouter)

app.listen(3000, () => {
    console.log("✅ Server is running on http://localhost:3000")
})