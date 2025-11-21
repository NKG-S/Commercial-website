// Controllers/userController.js
import User from "../Modules/User.js";
import Product from "../Modules/Product.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js"; // <--- Requires: npm install @supabase/supabase-js

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Supabase Configuration (From your provided frontend file) ---
const SUPABASE_URL = "https://oaacevaplgugwtvscznt.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hYWNldmFwbGd1Z3d0dnNjem50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDA4OTcsImV4cCI6MjA3OTIxNjg5N30.JpuL_ynhuD3UfGvQzQ0W3a5Gw-Z-yMv1z7XkRF6vfTU";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Helper: Delete Image from Supabase ---
const deleteImageFromSupabase = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    if (!imageUrl.includes(SUPABASE_URL)) return;

    const bucketName = "images";
    const pathParts = imageUrl.split(`${bucketName}/`);

    if (pathParts.length < 2) return;

    const pathToDelete = pathParts[1];

    const { error } = await supabase.storage.from(bucketName).remove([pathToDelete]);

    if (error) {
      console.error("Supabase deletion error:", error);
    } else {
      console.log("Supabase image deleted:", pathToDelete);
    }
  } catch (err) {
    console.error("Error deleting image from Supabase:", err);
  }
};

// --- 1. Check Email Availability ---
export async function checkEmail(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      return res.status(409).json({ message: "This email is already registered." });
    }

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
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "150h" });

      return res.json({
        message: "Authentication successful",
        token: token,
        user: payload,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Server error", error: err.message });
    });
}

// --- 3. Get Users (Admin Only) ---
export function getUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized Access - No Token / User" });
  }
  if (!req.user.role) {
    return res.status(401).json({ message: "Unauthorized Access - No Role Assigned" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden Access - Admins Only" });
  }

  User.find()
    .select("-password")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    });
}

// --- 4. Create User ---
export async function createUser(req, res) {
  const { email, password, firstName, lastName, role, image } = req.body;

  if (!email || !password || !firstName || !lastName || !image) {
    return res.status(400).json({
      message: "Email, password, first name, last name, and image are required",
    });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        message: "This email is already registered. Please use a different email.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      email: normalizedEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password: hashedPassword,
      role: role || "customer",
      image: image,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        image: newUser.image,
        isBlocked: newUser.isBlocked,
        iaEmailVerified: newUser.iaEmailVerified,
      },
    });
  } catch (err) {
    if (err.code === 11000 || (err.message && err.message.includes("duplicate key"))) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    console.error("Create user error:", err);
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

// --- 5. Get User Profile ---
export async function getUserProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ email: req.user.email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
}

// --- 6. Update User Profile ---
export async function updateUserProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { firstName, lastName, image } = req.body;

  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (image && user.image && image !== user.image) {
      await deleteImageFromSupabase(user.image);
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (image) user.image = image;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
}

// --- 7. Delete User Profile ---
export async function deleteUserProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.image) {
      await deleteImageFromSupabase(user.image);
    }

    await User.deleteOne({ email: req.user.email });

    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error("Delete profile error:", err);
    res.status(500).json({ message: "Server error deleting profile" });
  }
}

/**
 * Add item to User Cart
 * Route: POST /api/users/cart/:productId
 */
export async function addToCart(req, res) {
  try {
    // 1. Get User Email from the authenticated request (middleware sets req.user)
    const email = req.user.email;

    // 🔴 productId comes from URL params, NOT from body
    const { productId } = req.params;
    const { quantity } = req.body;

    // 2. Validation
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const itemQty = quantity ? Number(quantity) : 1;

    if (itemQty <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // 3. Find the Product to ensure it exists and get current price
    // productID here should match your Product schema field (e.g. "PRD0001")
    const product = await Product.findOne({ productID: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.isAvailable || product.stock < itemQty) {
      return res
        .status(400)
        .json({ message: "Product is out of stock or unavailable" });
    }

    // 4. Find the User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5. Check if item already exists in cart (cart uses string productId)
    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId === productId
    );

    if (cartItemIndex > -1) {
      // Item exists, update quantity
      user.cart[cartItemIndex].quantity += itemQty;
    } else {
      // Item does not exist, push new item
      user.cart.push({
        productId: product.productID, // snapshot of product ID
        quantity: itemQty,
        price: product.price, // snapshot of price
      });
    }

    // 6. Save User
    await user.save();

    res.status(200).json({
      message: "Item added to cart",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get User Cart
 * Route: GET /api/users/cart
 */
export async function getCart(req, res) {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
}

/**
 * Remove Item from User Cart
 * Route: DELETE /api/users/cart/:productId
 */
export async function removeFromCart(req, res) {
  try {
    const email = req.user.email;
    const { productId } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemExists = user.cart.some((item) => item.productId === productId);
    if (!itemExists) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    user.cart = user.cart.filter((item) => item.productId !== productId);

    await user.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
