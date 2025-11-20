import express from "express";
import { createProduct, getProducts, deleteProduct, updateProduct, getProductById } from "../Controllers/productController.js";

const productRouter = express.Router();

// Get all products
productRouter.get("/", getProducts);

// Create a new product
productRouter.post("/", createProduct);

// Get single product by productID
productRouter.get("/:productId", getProductById);

// Update product by productID
productRouter.put("/:productId", updateProduct);

// Delete product by productID
productRouter.delete("/:productId", deleteProduct);

export default productRouter;
