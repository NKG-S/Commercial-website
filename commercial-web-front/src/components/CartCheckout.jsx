// commercial-web-front/pages/CartCheckout.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, ShieldCheck, Package, Truck } from "lucide-react";

export default function CartCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const URL = "http://localhost:3000";

  useEffect(() => {
    // Check if data was passed from cart page
    if (location.state?.cartItems) {
      setCartItems(location.state.cartItems);
      setLoading(false);
    } else {
      // Otherwise fetch cart data
      fetchCartData();
    }
  }, [location.state]);

  const getToken = () => localStorage.getItem("token");

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError("Please log in to checkout.");
        setLoading(false);
        return;
      }

      // Fetch cart
      const cartResponse = await fetch(`${URL}/api/user/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!cartResponse.ok) throw new Error("Failed to fetch cart");

      const rawCart = await cartResponse.json();

      if (!rawCart || rawCart.length === 0) {
        setError("Your cart is empty");
        setLoading(false);
        return;
      }

      // Fetch product details
      const mergedCartItems = await Promise.all(
        rawCart.map(async (cartItem) => {
          try {
            const productResponse = await fetch(
              `${URL}/api/product/${cartItem.productId}`
            );
            const product = await productResponse.json();

            return {
              ...product,
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              cartPrice: cartItem.price
            };
          } catch (err) {
            console.error(`Failed to fetch product ${cartItem.productId}`, err);
            return null;
          }
        })
      );

      setCartItems(mergedCartItems.filter((item) => item !== null));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const shippingCost = 15.00;
  const subtotal = calculateSubtotal();
  const total = subtotal + (cartItems.length > 0 ? shippingCost : 0);

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) return;

    const purchaseData = {
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0]
      })),
      subtotal: subtotal,
      shipping: shippingCost,
      totalAmount: total,
      currency: "LKR",
      timestamp: new Date().toISOString()
    };

    navigate("/payment-gateway", { state: purchaseData });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#012561] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-[#012561] flex items-center justify-center text-white">
          <div className="text-center">
            <p className="text-xl text-red-400 mb-4">{error || "Your cart is empty"}</p>
            <button 
              onClick={() => navigate("/cart")} 
              className="underline hover:text-gray-300 transition"
            >
              Go Back to Cart
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#012561] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <button 
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </button>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Cart Items Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-400" />
                  Order Items ({cartItems.length})
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.productId}
                      className="flex gap-4 p-4 bg-black/20 rounded-xl border border-white/10"
                    >
                      <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.images?.[0] || "https://via.placeholder.com/80"} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <p className="text-sm text-gray-400">{item.brand}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-300">Qty: {item.quantity}</span>
                          <span className="text-sm font-medium">
                            LKR {item.price.toFixed(2)} each
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-400" />
                  Shipping Information
                </h2>
                <p className="text-gray-300 text-sm">
                  Standard shipping included. Estimated delivery: 3-5 business days
                </p>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl sticky top-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  Order Summary
                </h2>

                {/* Subtotal */}
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="font-medium">LKR {subtotal.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-300">Shipping</span>
                  <span className="font-medium">LKR {shippingCost.toFixed(2)}</span>
                </div>

                {/* Tax Info */}
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-300 text-sm">Tax</span>
                  <span className="text-sm text-gray-400">Included</span>
                </div>

                {/* Total */}
                <div className="py-6">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-lg text-gray-200">Total Amount</span>
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                      LKR {total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-right text-xs text-gray-400">All taxes included</p>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  Proceed to Payment
                  <ShieldCheck className="w-5 h-5" />
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Secure SSL Encrypted Transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}