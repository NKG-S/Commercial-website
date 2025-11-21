// commercial-web-front/pages/ProductDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  AlertCircle,
  Truck,
  Shield,
} from "lucide-react";


export default function ProductDetailsPage() {
  const { productId } = useParams(); // <-- productId from URL
  const navigate = useNavigate();
  const URL = "http://localhost:3000";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Cart state synced with localStorage so we can override quantity for same product
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e);
      return [];
    }
  });

  // Cart UI state
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // When cart or productId changes, set quantity to existing cart qty (override behavior)
  useEffect(() => {
    const existingItem = cartItems.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      setQuantity(existingItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [productId, cartItems]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${URL}/api/product/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      // Debug: see what we got
      console.log("Product details response:", response.status, response.url);

      if (!response.ok) throw new Error("Failed to fetch product details");

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    navigate(`/purchase/${productId}`, {
      state: { product, quantity },
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const token = localStorage.getItem("token");
    if (!token) {
      // If not logged in, redirect to login
      return navigate("/login");
    }

    try {
      setIsAddingToCart(true);
      setCartMessage(null);
      setCartError(null);

      const url = `${URL}/api/user/cart/${productId}`;
      console.log("Add to cart request →", url, "qty:", quantity);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      console.log("Add to cart response:", response.status, response.url);

      // Make sure we only try to parse JSON if it really is JSON
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response body:", text);
        throw new Error(
          `Unexpected response from server (status ${response.status}). Check backend route and URL.`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add item to cart");
      }

      console.log("Item added to cart:", data.cart);

      // FRONTEND CART UPDATE: override existing item instead of adding a new one
      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === productId
        );

        let updatedCart;
        if (existingIndex !== -1) {
          // Override quantity and product details for this item
          updatedCart = prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity, product }
              : item
          );
        } else {
          // Add new item
          updatedCart = [...prev, { productId, quantity, product }];
        }

        try {
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        } catch (e) {
          console.error("Failed to save cart to localStorage:", e);
        }

        return updatedCart;
      });

      setCartMessage("Cart updated 🎉");
    } catch (err) {
      console.error("Add to cart error:", err);
      setCartError(err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#012561] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#012561] flex flex-col items-center justify-center text-white">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-400 mb-6">
          {error || "The item you are looking for does not exist."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    name,
    description,
    price,
    labelledPrice,
    images = [],
    stock,
    category,
    brand,
    isAvailable,
  } = product;

  const discount =
    labelledPrice > price
      ? Math.round(((labelledPrice - price) / labelledPrice) * 100)
      : 0;

  return (
    <>

      <div className="min-h-screen bg-[#012561] pt-24 pb-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={
                    images[selectedImage] ||
                    "https://via.placeholder.com/600x600?text=No+Image"
                  }
                  alt={name}
                  className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-indigo-500"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details */}
            <div className="flex flex-col h-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-indigo-400 font-semibold uppercase tracking-wider text-sm">
                    {brand}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-red-500">
                      <Heart className="w-6 h-6" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-blue-400">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                  {name}
                </h1>

                <div className="flex items-end gap-4 mb-6">
                  <span className="text-4xl font-bold text-white">
                    LKR {price.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through mb-1">
                        LKR {labelledPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-sm font-bold mb-2">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-4">
                  {isAvailable && stock > 0 ? (
                    <span className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-sm font-medium">
                      <Check className="w-4 h-4" /> In Stock ({stock} available)
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-sm font-medium">
                      <AlertCircle className="w-4 h-4" /> Out of Stock
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                {isAvailable && stock > 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm text-gray-300">Quantity:</span>

                    <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">

                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10"
                      >
                        -
                      </button>

                      <span className="px-4 py-1">{quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((q) => (q < stock ? q + 1 : q))
                        }
                        className="px-3 py-1 bg-white/5 hover:bg-white/10"
                      >
                        +
                      </button>

                    </div>
                  </div>
                )}


                <div className="prose prose-invert text-gray-300 mb-8 max-w-none">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Description
                  </h3>
                  <p className="leading-relaxed">{description}</p>
                </div>

                {/* Features / Meta */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Truck className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm text-gray-300">
                      Island-wide Delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">
                      1 Year Warranty
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-6 border-t border-white/10">
                {cartMessage && (
                  <p className="text-sm text-green-400 mb-2">{cartMessage}</p>
                )}
                {cartError && (
                  <p className="text-sm text-red-400 mb-2">{cartError}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handlePurchase}
                    disabled={!isAvailable || stock === 0}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 ${
                      isAvailable && stock > 0
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable || stock === 0 || isAddingToCart}
                    className="flex-1 py-4 rounded-xl font-bold text-lg border border-white/20 hover:bg-white/10 transition-all text-white flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
