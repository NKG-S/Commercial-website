import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productID: {
      type: String,
      required: [true, "Product ID is required"],
      unique: true,
      trim: true,
      match: [/^PRD\d{6}$/, "Product ID must be in format PRD000000"]
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [200, "Product name cannot exceed 200 characters"]
    },
    altName: {
      type: String,
      trim: true,
      default: ""
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },
    labelledPrice: {
      type: Number,
      required: [true, "Labelled price is required"],
      min: [0, "Labelled price cannot be negative"]
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0 && arr.length <= 5;
        },
        message: "Product must have between 1 and 5 images"
      }
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Indexes for faster queries
productSchema.index({ category: 1 });
productSchema.index({ isAvailable: 1 });

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.labelledPrice > this.price) {
    return Math.round(
      ((this.labelledPrice - this.price) / this.labelledPrice) * 100
    );
  }
  return 0;
});

// Ensure virtuals are included in JSON output
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
