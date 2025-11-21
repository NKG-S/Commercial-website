import React from "react";

const CartCard = ({ item, onRemove, onUpdateQuantity }) => {
  // Destructure item properties
  const { productId, productID, name, brand, price, images, quantity, stock } = item;
  
  // Handle both productId and productID for compatibility
  const id = productId || productID;

  // Calculate subtotal for this specific item
  const subtotal = (price * quantity).toFixed(2);

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-100">
      
      {/* Image Section - Fixed size with consistent aspect ratio */}
      <div className="relative w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
        <img
          src={images && images.length > 0 ? images[0] : "/placeholder.png"}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Section - Fills remaining space */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full w-full">
        
        {/* Header: Brand, Name, Price */}
        <div className="mb-3">
          <div className="flex justify-between items-start">
            <div className="pr-4">
              <p className="text-[10px] font-bold text-indigo-500 tracking-wider uppercase mb-1">
                {brand}
              </p>
              <h3 className="text-lg font-semibold text-slate-800 leading-tight truncate max-w-[200px] sm:max-w-xs">
                {name}
              </h3>
            </div>
            {/* Price (Desktop position) */}
            <div className="text-right">
               <p className="text-lg font-bold text-slate-900">
                ${price}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">ID: {id}</p>
        </div>

        {/* Footer: Quantity & Subtotal & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-2 sm:pt-0">
          
          {/* Modern Quantity Control (Pill Shape) */}
          <div className="flex items-center bg-slate-50 rounded-full border border-slate-200 p-1">
            <button
              onClick={() => onUpdateQuantity(id, quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
              aria-label="Decrease quantity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span className="w-12 text-center text-sm font-semibold text-slate-700 select-none">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              disabled={stock !== undefined && quantity >= stock}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
              aria-label="Increase quantity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>

          {/* Right side actions group */}
          <div className="flex items-center gap-4 sm:gap-6 ml-auto">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Subtotal</p>
              <p className="text-lg font-bold text-indigo-600">${subtotal}</p>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(id)}
              className="group/btn flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
              title="Remove item"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartCard;