// Controllers/productController.js
import Product from "../Modules/Product.js";
import { createClient } from "@supabase/supabase-js";

// === Load environment variables early ===
import dotenv from "dotenv";
dotenv.config();

// === Environment Variables with Strong Validation ===
const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY?.trim();
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET?.trim() || "images";

// Critical: Validate Supabase URL format BEFORE creating client
if (!SUPABASE_URL) {
  console.error("❌ SUPABASE_URL is missing in .env file!");
  process.exit(1);
}
if (!SUPABASE_URL.startsWith("https://") || !SUPABASE_URL.includes(".supabase.co")) {
  console.error("❌ Invalid SUPABASE_URL!");
  console.error("   Current value:", SUPABASE_URL);
  console.error("   Must be: https://your-project-ref.supabase.co");
  process.exit(1);
}

if (!SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY is missing!");
  process.exit(1);
}

if (!SUPABASE_ANON_KEY.startsWith("eyJ") || !SUPABASE_SERVICE_ROLE_KEY.startsWith("eyJ")) {
  console.warn("⚠️  Warning: Supabase keys should start with 'eyJ' (JWT format)");
}

// === Secure Supabase Clients ===
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Product ID format: PRD followed by exactly 6 digits
const PRODUCT_ID_REGEX = /^PRD\d{6}$/;

/**
 * Middleware: Check if user is authenticated and is admin
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - Login required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access only" });
  }
  next();
}

// Attach to all admin routes like this:
// router.post("/create", requireAdmin, createProduct);

/**
 * Validate Product ID format (PRD000000 - PRD999999)
 */
function isValidProductId(id) {
  return typeof id === "string" && PRODUCT_ID_REGEX.test(id.trim());
}

/**
 * CREATE Product - Admin Only
 */
export async function createProduct(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin only" });
    }

    const {
      productID,
      name,
      price,
      brand,
      category,
      description,
      images,
      altName,
      labelledPrice,
      stock,
      isAvailable
    } = req.body;

    // === Input Validation ===
    if (!productID || !isValidProductId(productID)) {
      return res.status(400).json({
        error: "Invalid or missing productID. Must be format: PRD123456"
      });
    }

    if (!name?.trim()) return res.status(400).json({ error: "Product name is required" });
    if (!brand?.trim()) return res.status(400).json({ error: "Brand is required" });
    if (!category?.trim()) return res.status(400).json({ error: "Category is required" });
    if (!description?.trim()) return res.status(400).json({ error: "Description is required" });

    if (!price || isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ error: "Valid positive price is required" });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "At least one image URL is required" });
    }

    // Check for duplicate
    const existingProduct = await Product.findOne({ productID: productID.trim() });
    if (existingProduct) {
      return res.status(409).json({
        message: "Product ID already exists",
        product: existingProduct
      });
    }

    // === Create Product ===
    const product = new Product({
      productID: productID.trim(),
      name: name.trim(),
      altName: altName?.trim() || "",
      description: description.trim(),
      price: Number(price),
      labelledPrice: labelledPrice ? Number(labelledPrice) : Number(price),
      brand: brand.trim(),
      category: category.trim(),
      stock: stock !== undefined ? Math.max(0, Number(stock)) : 0,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      images
    });

    await product.save();

    console.log(`✅ Product created: ${product.productID} - ${product.name}`);
    return res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (err) {
    console.error("❌ Error creating product:", err);

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: "Validation failed", details: errors });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
}

/**
 * GET All Products (Public: only available, Admin: all)
 */
export async function getProducts(req, res) {
  try {
    const query = req.user?.role === "admin" ? {} : { isAvailable: true };
    const products = await Product.find(query).sort({ createdAt: -1 });

    return res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}

/**
 * GET Single Product by productID
 */
export async function getProductById(req, res) {
  try {
    const { productId } = req.params;

    if (!isValidProductId(productId)) {
      return res.status(400).json({ error: "Invalid Product ID format. Use PRDXXXXXX" });
    }

    const query = req.user?.role === "admin"
      ? { productID: productId }
      : { productID: productId, isAvailable: true };

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ message: "Product not found or unavailable" });
    }

    return res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    return res.status(500).json({ error: "Failed to fetch product" });
  }
}

/**
 * UPDATE Product - Admin Only
 */
export async function updateProduct(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin only" });
    }

    const { productId } = req.params;

    if (!isValidProductId(productId)) {
      return res.status(400).json({ error: "Invalid Product ID format" });
    }

    if (req.body.productID && req.body.productID !== productId) {
      return res.status(400).json({ error: "Cannot change productID" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { productID: productId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`✅ Product updated: ${productId}`);
    return res.json({ message: "Product updated successfully", product: updatedProduct });

  } catch (err) {
    console.error("❌ Error updating product:", err);

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: "Validation failed", details: errors });
    }

    return res.status(500).json({ error: "Failed to update product" });
  }
}

/**
 * DELETE Product + Images from Supabase - Admin Only
 */
export async function deleteProduct(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin only" });
    }

    const { productId } = req.params;

    if (!isValidProductId(productId)) {
      return res.status(400).json({ error: "Invalid Product ID format" });
    }

    const product = await Product.findOne({ productID: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // === Delete Images from Supabase Storage ===
    if (product.images && product.images.length > 0) {
      const filesToDelete = product.images
        .map(url => {
          try {
            const path = url.split(`/${SUPABASE_BUCKET}/`)[1];
            return path ? decodeURIComponent(path.split('?')[0]) : null;
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      if (filesToDelete.length > 0) {
        console.log(`🗑️ Deleting ${filesToDelete.length} image(s) from Supabase...`);
        const { error } = await supabaseAdmin
          .storage
          .from(SUPABASE_BUCKET)
          .remove(filesToDelete);

        if (error) {
          console.error("⚠️ Supabase storage delete error (continuing):", error.message);
        } else {
          console.log("✅ Images deleted from Supabase storage");
        }
      }
    }

    // === Delete from MongoDB ===
    await Product.deleteOne({ productID: productId });

    console.log(`✅ Product deleted successfully: ${productId}`);
    return res.json({ message: "Product and associated images deleted successfully" });

  } catch (err) {
    console.error("❌ Error deleting product:", err);
    return res.status(500).json({
      error: "Failed to delete product",
      message: err.message
    });
  }
}