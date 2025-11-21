// commercial-web-front/pages/categoryPage.jsx
import { useState, useEffect } from "react";
import { Search, Grid, List, Loader, TrendingUp, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../src/components/CategoryCard";

export default function CategoryPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-az");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const URL = "http://localhost:3000";

  // Fetch products and build categories
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${URL}/api/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
      
      // Build categories from products
      buildCategories(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Build categories with product counts
  const buildCategories = (productData) => {
    const categoryMap = new Map();
    
    productData.forEach(product => {
      const categoryName = product.category;
      
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          name: categoryName,
          description: `Explore our collection of ${categoryName.toLowerCase()} products`,
          productCount: 0,
          products: [],
          color: getColorForCategory(categoryName)
        });
      }
      
      const category = categoryMap.get(categoryName);
      category.productCount++;
      category.products.push(product);
      
      // Use first product image as category image if available
      if (!category.image && product.images && product.images.length > 0) {
        category.image = product.images[0];
      }
    });
    
    const categoriesArray = Array.from(categoryMap.values());
    setCategories(categoriesArray);
    setFilteredCategories(categoriesArray);
  };

  // Assign colors to categories
  const getColorForCategory = (categoryName) => {
    const colors = ["indigo", "blue", "green", "orange", "pink", "violet"];
    const index = categoryName.length % colors.length;
    return colors[index];
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...categories];

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case "name-az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "most-products":
        result.sort((a, b) => b.productCount - a.productCount);
        break;
      case "least-products":
        result.sort((a, b) => a.productCount - b.productCount);
        break;
      default:
        break;
    }

    setFilteredCategories(result);
  }, [searchQuery, sortBy, categories]);

  const handleCategoryClick = (categoryName) => {
    const encodedName = encodeURIComponent(categoryName);
    console.log("Navigating to category:", categoryName);
    navigate(`/category/${encodedName}`);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("name-az");
  };

  // Calculate total products
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Browse Categories
            </h1>
            <p className="text-xl text-gray-400">
              Explore products organized by category
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Grid className="w-5 h-5 text-indigo-400" />
                <span className="text-gray-400 text-sm">Total Categories</span>
              </div>
              <p className="text-3xl font-bold text-white">{categories.length}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">Total Products</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalProducts}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <span className="text-gray-400 text-sm">Avg per Category</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-w-[200px]"
                >
                  <option value="default" style={{ backgroundColor: "#1f2937", color: "#ffffff" }}> Sort by: Featured </option>
                  <option value="price-low" style={{ backgroundColor: "#1f2937", color: "#ffffff" }}> Price: Low to High </option>
                  <option value="price-high" style={{ backgroundColor: "#1f2937", color: "#ffffff" }}> Price: High to Low </option>
                  <option value="name" style={{ backgroundColor: "#1f2937", color: "#ffffff" }}> Name: A-Z </option>
                </select>
                
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || sortBy !== "name-az") && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <span className="text-sm text-gray-400">Active filters:</span>
                {searchQuery && (
                  <span className="bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full text-xs">
                    Search: "{searchQuery}"
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="ml-auto text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              Showing <span className="text-white font-semibold">{filteredCategories.length}</span> of{" "}
              <span className="text-white font-semibold">{categories.length}</span> categories
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-400 text-lg">Loading categories...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
              <p className="text-red-400 text-lg mb-4">⚠️ {error}</p>
              <button
                onClick={fetchProducts}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Categories Grid/List */}
          {!loading && !error && (
            <>
              {filteredCategories.length > 0 ? (
                <div className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {filteredCategories.map((category) => (
                    <CategoryCard
                      key={category.name}
                      category={category}
                      productCount={category.productCount}
                      onClick={() => handleCategoryClick(category.name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No categories found</h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search query
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-full font-semibold transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}