import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, CreditCard, ShieldCheck } from "lucide-react";
import Header from "../components/Header.jsx";
// import Header from "../components/Header.jsx"; // Commented out to prevent build error

export default function PurchaseCard() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const URL = "http://localhost:3000";

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URL}/api/product/${productId}`);
      
      if (!response.ok) throw new Error("Product not found");
      
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && (!product.stock || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleProceedToPayment = () => {
    if (!product) return;

    const totalAmount = product.price * quantity;
    
    const purchaseData = {
      productId: product.productID,
      productName: product.name,
      price: product.price,
      quantity: quantity,
      totalAmount: totalAmount,
      currency: "LKR",
      timestamp: new Date().toISOString()
    };

    // Navigate to payment gateway passing data in state
    navigate("/payment-gateway", { state: purchaseData });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#012561] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#012561] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">Error: {error || "Product not found"}</p>
          <button onClick={() => navigate(-1)} className="underline">Go Back</button>
        </div>
      </div>
    );
  }

  const total = product.price * quantity;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#012561] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Product</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Product Details */}
            <div className="space-y-6">
              <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/400"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-400">{product.brand}</p>
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                   <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:pl-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  Order Summary
                </h2>

                {/* Price Row */}
                <div className="flex justify-between items-center py-4 border-b border-white/10">
                  <span className="text-gray-300">Price per item</span>
                  <span className="text-xl font-medium">LKR {product.price.toFixed(2)}</span>
                </div>

                {/* Quantity Selector */}
                <div className="flex justify-between items-center py-6 border-b border-white/10">
                  <span className="text-gray-300">Quantity</span>
                  <div className="flex items-center gap-4 bg-black/20 rounded-lg p-1">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-white/10 rounded-md disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={product.stock && quantity >= product.stock}
                      className="p-2 hover:bg-white/10 rounded-md disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Total Calculation */}
                <div className="py-6">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-lg text-gray-200">Total Amount</span>
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                      LKR {total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-right text-xs text-gray-400">Includes all taxes</p>
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