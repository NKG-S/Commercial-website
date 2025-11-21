// commercial-web-front/src/components/CartCard.jsx
import React from "react";

const CartCard = ({ item, onRemove, onUpdateQuantity }) => {
  // Destructure item properties
  // Use productId (lowercase) consistently
  const { productId, productID, name, brand, price, images, quantity, stock } = item;
  
  // Handle both productId and productID for compatibility
  const id = productId || productID;

  // Calculate subtotal for this specific item
  const subtotal = (price * quantity).toFixed(2);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      
      {/* Left Section: Image & Details */}
      <div className="flex items-center w-full md:w-1/2">
        {/* Product Image */}
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-100">
          <img
            src={images && images.length > 0 ? images[0] : "/placeholder.png"}
            alt={name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text Details */}
        <div className="ml-4 flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            {brand}
          </p>
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-500">ID: {id}</p>
          <p className="mt-1 text-sm font-semibold text-indigo-600">
            ${price}
          </p>
        </div>
      </div>

      {/* Right Section: Quantity, Subtotal, Remove */}
      <div className="flex items-center justify-between w-full md:w-1/2 mt-4 md:mt-0 md:pl-8">
        
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => onUpdateQuantity(id, quantity - 1)}
            disabled={quantity <= 1}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            -
          </button>
          <span className="px-3 py-1 text-gray-900 font-medium border-x border-gray-300 min-w-[40px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(id, quantity + 1)}
            // Disable if stock limit reached (optional)
            disabled={stock !== undefined && quantity >= stock}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right mx-4">
          <p className="text-xs text-gray-500">Subtotal</p>
          <p className="text-lg font-bold text-gray-900">${subtotal}</p>
        </div>

        {/* Remove Button (Trash Icon) */}
        <button
          onClick={() => onRemove(id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
          title="Remove item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartCard;