import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "customer",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  iaEmailVerified: {
    type: Boolean,
    default: false,
  },
  image: {
    type: [String],
    required: [true, "At least one image is required"],
  },
  // === NEW: Cart Field ===
  cart: [
    {
      productId: {
        type: String, // Stores the "PRDxxxxxx" ID
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number, // Optional: store snapshot of price when added
        required: true
      }
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;