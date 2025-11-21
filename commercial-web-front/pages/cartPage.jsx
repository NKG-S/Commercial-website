// commercial-web-front/pages/cartPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CartCard from "../src/components/CartCard.jsx"
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const URL = "http://localhost:3000";

  // Helper: Get Token
  const getToken = () => localStorage.getItem("token");

  // === 1. Fetch Cart & Product Data ===
  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      const token = getToken();
      
      if (!token) {
        setError("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      // A. Fetch the User's Cart (IDs + Quantities)
      const cartResponse = await axios.get(`${URL}/api/user/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawCart = cartResponse.data; // [{ productId: "PRD...", quantity: 2, price:... }]

      if (!rawCart || rawCart.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      // B. Fetch Full Product Details for each item in the cart
      const mergedCartItems = await Promise.all(
        rawCart.map(async (cartItem) => {
          try {
            const productResponse = await axios.get(
              `${URL}/api/product/${cartItem.productId}`
            );
            const product = productResponse.data;

            // C. Merge Backend Cart Data with Product Data
            return {
              ...product, // Name, Images, Brand, Stock, etc.
              productId: cartItem.productId, // Use productId (lowercase) consistently
              quantity: cartItem.quantity, // Overwrite with user's cart quantity
              cartPrice: cartItem.price // Keep track of price when added (optional)
            };
          } catch (err) {
            console.error(`Failed to fetch product ${cartItem.productId}`, err);
            return null; // Handle products that might have been deleted
          }
        })
      );

      // Filter out nulls (in case a product was deleted from DB but still in cart)
      setCartItems(mergedCartItems.filter((item) => item !== null));

    } catch (err) {
      console.error("Error fetching cart:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to load cart data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // === 2. Handle Remove Item ===
  const handleRemoveItem = async (productId) => {
    try {
      const token = getToken();
      await axios.delete(`${URL}/api/user/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistic Update: Remove from UI immediately
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Error removing item", err);
      alert("Could not remove item.");
    }
  };

  // === 3. Handle Quantity Update ===
  const handleUpdateQuantity = async (productId, newQuantity) => {
    // Prevent updating to 0 or negative (use remove button for that)
    if (newQuantity < 1) return;

    try {
      const token = getToken();
      
      // Find current item to calculate the difference needed
      const currentItem = cartItems.find((item) => item.productId === productId);
      if (!currentItem) return;

      // Calculate difference: e.g., Current 2, New 3 => send +1. Current 2, New 1 => send -1.
      const quantityDifference = newQuantity - currentItem.quantity;

      // We reuse the 'addToCart' endpoint which sums the quantity
      await axios.post(
        `${URL}/api/user/cart/${productId}`,
        { quantity: quantityDifference },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );

    } catch (err) {
      console.error("Error updating quantity", err);
      alert("Could not update quantity. Check stock availability.");
    }
  };

  // === 4. Calculations ===
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ).toFixed(2);
  };

  const shippingCost = 15.00; // Example fixed cost
  const grandTotal = (parseFloat(calculateTotal()) + (cartItems.length > 0 ? shippingCost : 0)).toFixed(2);

  // === Render ===
  if (loading) return <div className="flex justify-center mt-20 text-lg">Loading Cart...</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="text-red-500 text-lg mb-4">{error}</div>
      {error.includes("log in") && (
        <button 
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Go to Login
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl text-gray-600">Your cart is empty.</h2>
            <button 
                onClick={() => navigate("/product")}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
                Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Cart Items */}
            <div className="flex-1">
              {cartItems.map((item) => (
                <CartCard
                  key={item.productId}
                  item={item}
                  onRemove={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {cartItems.length > 0 ? `$${shippingCost.toFixed(2)}` : "$0.00"}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 my-4 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">${grandTotal}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">Including VAT</p>
                </div>

                <button 
                    className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                    onClick={() => alert("Proceed to Checkout integration needed!")}
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6 flex justify-center">
                    <button onClick={() => navigate("/product")} className="text-sm text-indigo-600 hover:underline">
                        or Continue Shopping
                    </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;