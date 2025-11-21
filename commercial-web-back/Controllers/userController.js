import User from "../Modules/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// --- 1. Check Email Availability (Required for Frontend Step 1) ---
// This function checks if an email exists without requiring a password.
// It uses the same 'findOne' logic as login to ensure accuracy.
export async function checkEmail(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        // Uses the same lookup logic as logInUser to see if user exists
        const user = await User.findOne({ email: normalizedEmail });

        if (user) {
            // Frontend expects 409 if email is taken
            return res.status(409).json({ message: "This email is already registered." });
        }

        // Frontend expects 200 if email is free to use
        return res.status(200).json({ message: "Email is available" });
    } catch (err) {
        console.error("Check email error:", err);
        return res.status(500).json({ message: "Server error checking email" });
    }
}

// --- 2. Log In User ---
export function logInUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            // user not found
            if (!user) {
                return res.status(401).json({ message: "Authentication failed" });
            }

            // compare given password with hashed password
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Authentication failed" });
            }

            // build payload for token
            const payload = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            };

            // create token
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "150h" });

            // send token to client
            return res.json({
                message: "Authentication successful",
                token: token,
                userdata: payload
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err.message });
        });
}

// --- 3. Get Users (Admin Only) ---
export function getUser(req, res) {
    // 1. No token / no decoded user
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized Access - No Token / User" });
    }

    // 2. No role in token
    if (!req.user.role) {
        return res.status(401).json({ message: "Unauthorized Access - No Role Assigned" });
    }

    // 3. Not admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden Access - Admins Only" });
    }

    // 4. Is admin → return all users
    User.find().select('-password').then(users => {
        res.json(users);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    });
}

// --- 4. Create User (Step 3 of Frontend Flow) ---
export async function createUser(req, res) {
    const { email, password, firstName, lastName, role, image } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName || !image) {
        return res.status(400).json({
            message: "Email, password, first name, last name, and image are required"
        });
    }

    try {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Double check if user exists (Frontend checks first, but DB needs protection)
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered. Please use a different email."
            });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new user
        const newUser = new User({
            email: normalizedEmail,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password: hashedPassword,
            role: role || "customer",
            image: image, // Stores the array sent from frontend
        });

        // Save user
        await newUser.save();

        // Success response
        res.status(201).json({
            message: "User created successfully",
            user: {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                image: newUser.image,
                isBlocked: newUser.isBlocked,
                iaEmailVerified: newUser.iaEmailVerified
            }
        });

    } catch (err) {
        // Handle duplicate email from MongoDB unique index
        if (err.code === 11000 || (err.message && err.message.includes("duplicate key"))) {
            return res.status(409).json({
                message: "This email is already registered."
            });
        }

        console.error("Create user error:", err);
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
}