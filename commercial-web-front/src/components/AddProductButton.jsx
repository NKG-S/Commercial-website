import axios from "axios";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload.jsx"; // Assuming this is your file input component
import { useState, useCallback } from "react";
import { SupabaseUploader } from "../utils/SupabaseUploader.js"; // Corrected import

// --- Configuration ---
const REACT_APP_API_BASE_URL = "http://localhost:3000"; // Should ideally come from .env
const API_BASE_URL = REACT_APP_API_BASE_URL;
const ADD_PRODUCT_URL = `${API_BASE_URL}/api/product`;

// Product ID validation: PRD + 6 digits (e.g., PRD000001)
const PRODUCT_ID_REGEX = /^PRD\d{6}$/;

function isValidProductId(productId) {
  return PRODUCT_ID_REGEX.test(productId);
}

// Initial form state
const initialFormData = {
  productID: "",
  name: "",
  altName: "",
  description: "",
  price: "",
  labelledPrice: "",
  category: "",
  brand: "",
  stock: 0,
  isAvailable: true // will be overridden based on stock
};

export const AddProductButton = ({ onProductAdded }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // Memoized reset function
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFilesToUpload([]);
  }, []);

  // Handler to receive the list of selected files from ImageUpload
  const handleFilesSelection = (files) => {
    setFilesToUpload(files);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      let newValue = type === "checkbox" ? checked : value;

      // Ensure stock is never negative and update isAvailable automatically
      if (name === "stock") {
        const raw = Number(newValue);
        const safeStock = isNaN(raw) || raw < 0 ? 0 : raw;
        newValue = String(safeStock);

        const updated = {
          ...prev,
          [name]: newValue,
          isAvailable: safeStock > 0 // auto: stock 0 -> false, >0 -> true
        };
        return updated;
      }

      return {
        ...prev,
        [name]: newValue
      };
    });
  };

  // Handle modal close
  const handleClose = () => {
    if (isSubmitting) {
      toast.error("Please wait for the current operation to complete");
      return;
    }
    setIsAdding(false);
    resetForm();
  };

  // Handle product submission
  const handleAddProduct = async () => {
    // Basic required field checks and validation
    if (!formData.productID.trim()) {
      toast.error("Product ID is required");
      return;
    }

    const trimmedProductId = formData.productID.trim();

    if (!isValidProductId(trimmedProductId)) {
      toast.error(
        "Invalid Product ID format. Use PRD followed by 6 digits (e.g., PRD000001)"
      );
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Product Name is required");
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Valid price is required");
      return;
    }

    if (!formData.brand.trim()) {
      toast.error("Brand is required");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Category is required");
      return;
    }

    if (
      !formData.description.trim() ||
      formData.description.trim().length < 10
    ) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    const stockNum = Number(formData.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    if (filesToUpload.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Validating product and saving...");

    try {
      // 1️⃣ Get auth token BEFORE doing anything expensive
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // 2️⃣ Check if product already exists in DB
      try {
        const checkResponse = await axios.get(
          `${ADD_PRODUCT_URL}/${trimmedProductId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        // If we reach here with status 200, product exists → DO NOT upload images or submit data
        if (checkResponse.status === 200 && checkResponse.data) {
          toast.error(`Product ID ${trimmedProductId} already exists!`, {
            id: loadingToast
          });
          return;
        }
      } catch (checkErr) {
        if (checkErr.response) {
          const { status, data } = checkErr.response;

          if (status === 404) {
            // ✅ Product does not exist → OK to proceed
          } else if (status === 400) {
            // Server also thinks ID is invalid → DO NOT upload images
            const serverMsg =
              data?.error || "Invalid Product ID format according to server";
            toast.error(serverMsg, { id: loadingToast });
            return;
          } else {
            // Any other error from server while checking → DO NOT upload images or submit data
            const serverMsg =
              data?.error ||
              data?.message ||
              `Failed to validate product ID (status ${status})`;
            toast.error(serverMsg, { id: loadingToast });
            return;
          }
        } else {
          // Network or unexpected error → DO NOT upload images or submit data
          console.error("Error checking existing product:", checkErr);
          toast.error(
            "Failed to validate product ID. Please try again.",
            { id: loadingToast }
          );
          return;
        }
      }

      // 3️⃣ At this point:
      //    - Product ID is valid
      //    - Product with this ID does NOT exist in DB
      //    → Now upload images

      console.log("Uploading images to Supabase...");
      const uploadedImageUrls = await SupabaseUploader(filesToUpload);
      console.log("Images uploaded successfully:", uploadedImageUrls);

      // 4️⃣ Prepare and submit product data
      const labelledPriceNum = Number(formData.labelledPrice);
      const finalStock = isNaN(stockNum) || stockNum < 0 ? 0 : stockNum;
      const autoIsAvailable = finalStock > 0;

      const productData = {
        ...formData,
        productID: trimmedProductId,
        price: priceNum,
        labelledPrice:
          isNaN(labelledPriceNum) || labelledPriceNum <= 0
            ? priceNum
            : labelledPriceNum,
        stock: finalStock,
        isAvailable: autoIsAvailable, // auto based on stock
        images: uploadedImageUrls
      };

      console.log("Submitting product data:", productData);

      const response = await axios.post(ADD_PRODUCT_URL, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Server response:", response);

      // Check for success or specific duplicate message (should not happen now, but kept as safety)
      if (response.status === 201 || response.status === 200) {
        if (response.data.message?.includes("already exists")) {
          toast.error(
            `Product ID ${trimmedProductId} already exists!`,
            { id: loadingToast }
          );
          return;
        }

        // Success
        toast.success("Product added successfully!", { id: loadingToast });
        setIsAdding(false);
        resetForm();

        // Callback to parent component
        if (onProductAdded) {
          onProductAdded();
        }
      } else {
        // Handle unexpected successful response status (e.g., 202, 204)
        throw new Error(
          `Unexpected server response status: ${response.status}`
        );
      }
    } catch (err) {
      console.error("Error adding product:", err);

      let errorMsg = "Failed to add product";

      if (err.response) {
        errorMsg =
          err.response.data?.error ||
          err.response.data?.message ||
          `Server Error: ${err.response.status}`;
      } else if (err.message) {
        errorMsg = err.message;
      }

      toast.error(`${errorMsg}. Check console for details.`, {
        id: loadingToast
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Add Button */}
      <button
        onClick={() => setIsAdding(true)}
        className="fixed bottom-8 right-8 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center w-16 h-16 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label="Add new product"
        disabled={isSubmitting}
      >
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Add Product Modal */}
      {isAdding && (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              
              {/* Modal Panel */}
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                
                {/* Header */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-100">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                    Create New Product
                  </h3>
                  <button 
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form Content */}
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">

                    {/* Product ID */}
                    <div className="sm:col-span-2">
                      <label htmlFor="productID" className="block text-sm font-medium leading-6 text-gray-900">
                        Product ID <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="productID"
                          id="productID"
                          placeholder="e.g., PRD000001"
                          value={formData.productID}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500">Format: PRD followed by 6 digits.</p>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter product name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                    </div>

                    {/* Brand */}
                    <div>
                      <label htmlFor="brand" className="block text-sm font-medium leading-6 text-gray-900">
                        Brand <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="brand"
                          id="brand"
                          placeholder="e.g. Nike, Sony"
                          value={formData.brand}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="category"
                          id="category"
                          placeholder="e.g. Electronics"
                          value={formData.category}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="price"
                          id="price"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          min="0"
                          step="0.01"
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                    </div>

                    {/* Labelled Price */}
                    <div>
                      <label htmlFor="labelledPrice" className="block text-sm font-medium leading-6 text-gray-900">
                        MRP / Labelled Price
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="labelledPrice"
                          id="labelledPrice"
                          placeholder="0.00"
                          value={formData.labelledPrice}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          min="0"
                          step="0.01"
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="sm:col-span-2">
                      <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">
                        Stock Quantity
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="stock"
                          id="stock"
                          placeholder="0"
                          value={formData.stock}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          min="0"
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Availability Status Panel */}
                    <div className="sm:col-span-2">
                      <div className={`rounded-md p-4 ${Number(formData.stock) > 0 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className={`text-sm font-medium ${Number(formData.stock) > 0 ? 'text-green-800' : 'text-red-800'}`}>
                              Availability Status: {Number(formData.stock) > 0 ? 'Available' : 'Out of Stock'}
                            </h3>
                            <div className={`mt-2 text-sm ${Number(formData.stock) > 0 ? 'text-green-700' : 'text-red-700'}`}>
                              <p>System automatically sets this based on stock quantity entered above.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alternate Name */}
                    <div className="sm:col-span-2">
                      <label htmlFor="altName" className="block text-sm font-medium leading-6 text-gray-900">
                        Alternate Name <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="altName"
                          id="altName"
                          placeholder="e.g. Search alias"
                          value={formData.altName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <textarea
                          name="description"
                          id="description"
                          rows={4}
                          placeholder="Enter detailed product description..."
                          value={formData.description}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                        Product Images <span className="text-red-500">*</span>
                      </label>
                      <div className="rounded-md border border-gray-200 p-4 bg-gray-50">
                         <ImageUpload onFilesChange={handleFilesSelection} />
                         <p className="text-xs text-gray-500 mt-2 text-center">Supported formats: JPG, PNG, WEBP.</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    disabled={isSubmitting}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Uploading & Saving..." : "Add Product"}
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
    </>
  );
};