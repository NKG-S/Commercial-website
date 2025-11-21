import { useState } from "react";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate(); // Initialize hook
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Handle missing product data
  if (!product) return null;

  // We need the ID to navigate
  const {
    id,  // SQL ID sometimes
    productID, // Added to match your DB schema
    name,
    altName,
    description,
    price,
    labelledPrice,
    category,
    brand,
    stock,
    isAvailable,
    images = [],
    discountPercentage
  } = product;

  // Use productID (e.g. PRD000004) if available, fallback to id
  const productId = productID || id;

  const hasMultipleImages = images.length > 1;

  // Navigate to details page
  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  // Navigate to next image
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // Navigate to previous image
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Toggle like
  const toggleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };


  // Calculate if there's a discount
  const hasDiscount = labelledPrice > price;
  const discount = discountPercentage || (hasDiscount ? Math.round(((labelledPrice - price) / labelledPrice) * 100) : 0);

  return (
    <div 
      onClick={handleCardClick} // Add click handler to the main container
      className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer"
    >
      
      {/* Image Section with Slideshow */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-800/50 to-slate-900/50 overflow-hidden group">
        {/* Main Image */}
        <img
          src={images[currentImageIndex] || "https://via.placeholder.com/400x500?text=No+Image"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Stock Status Badge */}
        {!isAvailable || stock === 0 ? (
          <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        ) : stock < 10 ? (
          <div className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
            Low Stock
          </div>
        ) : null}

        {/* Discount Badge */}
        {hasDiscount && discount > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discount}%
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={toggleLike}
          className="absolute top-3 right-3 bg-white/10 backdrop-blur-md hover:bg-white/20 p-2 rounded-full transition-all"
          style={{ top: hasDiscount ? '3.5rem' : '0.75rem' }}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        {/* Image Navigation - Show only if multiple images */}
        {hasMultipleImages && (
          <>
            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4 space-y-3">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-indigo-400 font-semibold uppercase">{brand}</span>
          <span className="text-gray-400 bg-white/5 px-2 py-1 rounded">{category}</span>
        </div>

        {/* Product Name */}
        <div>
          <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight">
            {name}
          </h3>
          {altName && (
            <p className="text-gray-400 text-sm mt-1">{altName}</p>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">
            LKR {price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              LKR {labelledPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            {stock > 0 ? `${stock} items in stock` : "Out of stock"}
          </span>
          {isAvailable && stock > 0 && (
            <span className="text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

