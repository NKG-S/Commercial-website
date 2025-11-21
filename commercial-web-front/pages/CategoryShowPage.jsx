// commercial-web-front/pages/CategoryShowPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, SlidersHorizontal } from "lucide-react";

// Added .jsx extension to imports to resolve build errors
import Header from "../src/components/Header.jsx"; 
import ProductCard from "../src/components/ProductCard.jsx";

export default function CategoryShowPage() {
  // Hooks
  const { categoryName } = useParams(); // Capture the dynamic :categoryName from URL
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const URL = "http://localhost:3000";

  // Fetch data when categoryName changes
  useEffect(() => {
    fetchProductsByCategory();
  }, [categoryName]);

  const fetchProductsByCategory = async () => {
  try {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    const response = await fetch(`${URL}/api/product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();

    // 1. Decode the URL parameter
    const categoryToMatch = decodeURIComponent(categoryName);

    // DEBUGGING: Check your console to see what is actually being compared
    console.log("Target Category:", categoryToMatch);
    console.log("Sample Product Category:", data.length > 0 ? data[0].category : "No products");

    // 2. Filter with normalization (Lowercase + Trim)
    const filtered = data.filter((product) => {
      // Safety check in case product.category is null/undefined
      if (!product.category) return false; 
      
      return (
        product.category.trim().toLowerCase() === 
        categoryToMatch.trim().toLowerCase()
      );
    });

    setProducts(filtered);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // Handle Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button & Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white capitalize">
                  {decodeURIComponent(categoryName)}
                </h1>
                <p className="text-gray-400 text-sm">
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="default">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400">Error: {error}</p>
              <button 
                onClick={fetchProductsByCategory}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl text-white font-semibold">No products found</h2>
              <p className="text-gray-400">This category currently has no items.</p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <div key={product._id || product.id} className="flex justify-center">
                   {/* ProductCard handles the internal navigation to /product/:id */}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}