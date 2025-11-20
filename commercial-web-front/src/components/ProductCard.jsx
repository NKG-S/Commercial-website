import { useState } from "react";

export default function ProductCard(props) {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-row items-center justify-center gap-4 border border-gray-200 bg-white rounded-2xl p-4 w-fit shadow-sm hover:shadow-xl transition-all duration-300">

      <button 
        type="button"
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold hover:brightness-110 active:scale-95 transition-all"
        onClick={() => {
          console.log("Incrementing",count)
          setCount(count + 1)
        }}
      >
        Increment
      </button>

      <h1 className="text-3xl font-bold text-gray-800 w-10 text-center">{count}</h1>

      <button 
        type="button"
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold hover:brightness-110 active:scale-95 transition-all"
        onClick={() => {
          console.log("Decrementing",count)
          setCount(count - 1)
        }}
      >
        Decrement
      </button>

    </div>
  );
}
