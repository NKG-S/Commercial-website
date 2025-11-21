// src/components/DataTable.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Accept reloadKey as a prop
const DataTable = ({ reloadKey }) => {
  // --- State Management ---
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Edit / Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const URL = "http://localhost:3000";  
  const ProductsURL = `${URL}/api/product`;

  // --- 1. Fetch Data ---
  useEffect(() => {
    fetchProducts();
  }, [reloadKey]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(ProductsURL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
      setFilteredProducts(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load products");
      console.error(err);
      setLoading(false);
    }
  };

  // --- 2. Search Functionality ---
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(lowerTerm) || 
        product.productID.toLowerCase().includes(lowerTerm)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // --- 3. Actions ---

  // Delete Product
  const handleDelete = async (productID) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const toastId = toast.loading("Deleting product...");

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${ProductsURL}/${productID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product deleted successfully", { id: toastId });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Delete failed", { id: toastId });
    }
  };

  // Open Edit Modal
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => {
      let newValue = type === "checkbox" ? checked : value;

      // Auto-update isAvailable based on stock
      if (name === "stock") {
        const stockNum = Number(newValue);
        const safeStock = isNaN(stockNum) || stockNum < 0 ? 0 : stockNum;
        
        return {
          ...prev,
          [name]: safeStock,
          isAvailable: safeStock > 0
        };
      }

      return {
        ...prev,
        [name]: newValue
      };
    });
  };

  // Close Modal
  const handleClose = () => {
    if (isSubmitting) {
      toast.error("Please wait for the current operation to complete");
      return;
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({});
  };

  // Save Updated Product - FIXED VERSION
  const handleUpdate = async () => {
    // Trim all string values first
    const trimmedName = formData.name?.trim();
    const trimmedBrand = formData.brand?.trim();
    const trimmedCategory = formData.category?.trim();
    const trimmedDescription = formData.description?.trim();

    // === VALIDATION (Same as AddProductButton) ===
    if (!trimmedName) {
      toast.error("Product Name is required");
      return;
    }

    if (!trimmedBrand) {
      toast.error("Brand is required");
      return;
    }

    if (!trimmedCategory) {
      toast.error("Category is required");
      return;
    }

    if (!trimmedDescription || trimmedDescription.length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Valid price is required");
      return;
    }

    const stockNum = Number(formData.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Updating product...");

    try {
      const token = localStorage.getItem("token");

      // Exclude fields that shouldn't be updated
      const { _id, productID, __v, createdAt, updatedAt, ...updateData } = formData;

      // Calculate final values with STRICT TYPE CONVERSION (Same as AddProductButton)
      const labelledPriceNum = Number(updateData.labelledPrice);
      const finalStock = Math.max(0, stockNum); // Ensure non-negative
      const autoIsAvailable = finalStock > 0;

      // Prepare update payload with proper types
      const updatePayload = {
        name: trimmedName,
        brand: trimmedBrand,
        category: trimmedCategory,
        description: trimmedDescription,
        price: priceNum, // Number
        labelledPrice: (isNaN(labelledPriceNum) || labelledPriceNum <= 0) ? priceNum : labelledPriceNum, // Number
        stock: finalStock, // Number (not string!)
        isAvailable: autoIsAvailable, // Boolean
        altName: updateData.altName?.trim() || "" // String (empty if not provided)
      };

      console.log("Sending update payload:", updatePayload);

      await axios.put(
        `${ProductsURL}/${editingProduct.productID}`,
        updatePayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product updated successfully", { id: toastId });
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Update error:", err);
      
      let errorMsg = "Update failed";
      
      if (err.response?.data) {
        const data = err.response.data;
        
        if (data.error) {
          errorMsg = data.error;
        } else if (data.details) {
          // Mongoose validation errors
          errorMsg = `Validation failed: ${data.details.join(", ")}`;
        } else if (data.message) {
          errorMsg = data.message;
        }
      }
      
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      
      {/* Header & Search Section */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Product Inventory
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your catalog, pricing, and stock levels. ({products.length} items)
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72 mt-4 sm:mt-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          />
        </div>
      </div>

      {/* DESKTOP VIEW (Table) */}
      <div className="hidden md:block bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Brand
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Images
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.images?.[0] && (
                           <img src={product.images[0]} alt="" className="h-10 w-10 rounded-full object-cover mr-3 border" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{product.productID}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                      <div className="text-xs text-gray-500">{product.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">LKR {product.price.toLocaleString()}</div>
                      {product.labelledPrice && product.labelledPrice > product.price && (
                        <div className="text-xs text-gray-500 line-through">LKR {product.labelledPrice.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {product.isAvailable ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800">
                        {product.images?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.productID)}
                        className="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE VIEW (Cards) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">No products found.</div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-xl shadow border border-gray-200 flex gap-4">
              {/* Image */}
              <div className="flex-shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="h-24 w-24 object-cover rounded-lg" />
                ) : (
                  <div className="h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No Img</div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{product.productID}</p>
                  </div>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock}
                  </span>
                </div>
                
                <div className="mt-1 text-sm text-gray-600 flex justify-between">
                    <span>{product.category}</span>
                    <span>{product.brand}</span>
                </div>
                
                <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-lg font-bold text-indigo-600">LKR {product.price.toLocaleString()}</p>
                    {product.labelledPrice && product.labelledPrice > product.price && (
                        <p className="text-xs text-gray-400 line-through">LKR {product.labelledPrice.toLocaleString()}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-3">
                  <button onClick={() => handleEdit(product)} className="flex-1 bg-indigo-50 text-indigo-600 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.productID)} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {isModalOpen && editingProduct && (
        <div
          className="relative z-50"
          aria-labelledby="edit-product-modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Dark overlay */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          {/* Modal container */}
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              {/* Modal Card */}
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-4xl">
                
                {/* Header */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-100">
                  <h3
                    className="text-lg font-semibold leading-6 text-gray-900"
                    id="edit-product-modal-title"
                  >
                    Edit Product
                  </h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label="Close edit product modal"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    {/* Product ID - Read Only */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="edit-productID"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Product ID (Read-only)
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          id="edit-productID"
                          name="productID"
                          value={formData.productID || ""}
                          disabled
                          className="block w-full rounded-md border-0 py-2 px-3 bg-gray-100 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 cursor-not-allowed sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Product Name */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="edit-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          id="edit-name"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          required
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Brand */}
                    <div>
                      <label
                        htmlFor="edit-brand"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Brand <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          id="edit-brand"
                          name="brand"
                          value={formData.brand || ""}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          required
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label
                        htmlFor="edit-category"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          id="edit-category"
                          name="category"
                          value={formData.category || ""}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          required
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <label
                        htmlFor="edit-price"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Price (LKR) <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          id="edit-price"
                          name="price"
                          value={formData.price || ""}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          min="0"
                          step="0.01"
                          required
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Labelled Price */}
                    <div>
                      <label
                        htmlFor="edit-labelledPrice"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        MRP / Labelled Price
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          id="edit-labelledPrice"
                          name="labelledPrice"
                          value={formData.labelledPrice || ""}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          min="0"
                          step="0.01"
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Stock */}
                    <div>
                      <label
                        htmlFor="edit-stock"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Stock Quantity
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          id="edit-stock"
                          name="stock"
                          value={formData.stock ?? 0}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          min="0"
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Alt Name */}
                    <div>
                      <label
                        htmlFor="edit-altName"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Alternate Name{" "}
                        <span className="text-xs text-gray-500 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          id="edit-altName"
                          name="altName"
                          value={formData.altName || ""}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Images Info - Read Only */}
                    <div className="sm:col-span-2">
                      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Product Images (Cannot be edited here)
                        </p>
                        <p className="text-xs text-gray-500">
                          {formData.images?.length || 0} image(s) currently associated
                          with this product
                        </p>
                        {formData.images && formData.images.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {formData.images.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Product ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded border"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="edit-description"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="edit-description"
                          name="description"
                          value={formData.description || ""}
                          onChange={handleInputChange}
                          rows={4}
                          disabled={isSubmitting}
                          required
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none"
                        />
                      </div>
                    </div>

                    {/* Auto-Availability Info */}
                    <div className="sm:col-span-2">
                      <div
                        className={`rounded-md p-4 ${
                          Number(formData.stock) > 0
                            ? "bg-green-50 border border-green-100"
                            : "bg-red-50 border border-red-100"
                        }`}
                      >
                        <h3
                          className={`text-sm font-medium ${
                            Number(formData.stock) > 0
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          Availability Status:{" "}
                          {Number(formData.stock) > 0 ? "Available" : "Out of Stock"}
                        </h3>
                        <p
                          className={`mt-1 text-xs ${
                            Number(formData.stock) > 0
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          Availability is automatically set based on stock quantity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={isSubmitting}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DataTable;