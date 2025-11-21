// commercial-web-front/src/components/CategoryCard.jsx
import { useState } from "react";
import { Package, ChevronRight, TrendingUp } from "lucide-react";

export default function CategoryCard({ category, productCount, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  // Handle missing category data
  if (!category) return null;

  const {
    name,
    description,
    image,
    icon,
    color = "indigo"
  } = category;

  // Color variants for different categories
  const colorVariants = {
    indigo: "from-indigo-600 to-purple-600",
    blue: "from-blue-600 to-cyan-600",
    green: "from-green-600 to-emerald-600",
    orange: "from-orange-600 to-red-600",
    pink: "from-pink-600 to-rose-600",
    violet: "from-violet-600 to-fuchsia-600"
  };

  const gradient = colorVariants[color] || colorVariants.indigo;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-800/50 to-slate-900/50 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Package className="w-24 h-24 text-white/50" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Product Count Badge */}
        <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Package className="w-4 h-4" />
          {productCount || 0}
        </div>

        {/* Trending Badge (optional) */}
        {productCount > 10 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        )}
      </div>

      {/* Category Details Section */}
      <div className="p-5 space-y-3">
        {/* Category Name */}
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-xl line-clamp-1">
            {name}
          </h3>
          <ChevronRight 
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isHovered ? "translate-x-1 text-white" : ""
            }`}
          />
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Stats Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-gray-400 text-sm">
            {productCount === 0 && "No products yet"}
            {productCount === 1 && "1 product"}
            {productCount > 1 && `${productCount} products`}
          </span>
          <button
            className={`text-sm font-semibold transition-all duration-300 ${
              isHovered 
                ? `bg-gradient-to-r ${gradient} text-transparent bg-clip-text` 
                : "text-indigo-400"
            }`}
          >
            Browse →
          </button>
        </div>

        {/* Hover Effect Bar */}
        <div className={`h-1 rounded-full bg-gradient-to-r ${gradient} transition-all duration-300 ${
          isHovered ? "w-full opacity-100" : "w-0 opacity-0"
        }`} />
      </div>
    </div>
  );
}