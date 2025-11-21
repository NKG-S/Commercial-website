// AdminProductPage.jsx
import React, { useState } from "react";
import DataTable from "../src/components/DataTable.jsx";
import { AddProductButton } from "../src/components/AddProductButton.jsx";

export const AdminProductPage = () => {
  // 1. State to trigger the DataTable reload
  const [reloadKey, setReloadKey] = useState(0);

  // 2. Callback function passed to AddProductButton
  const handleProductAdded = () => {
    // Incrementing the key forces DataTable's useEffect to run again
    setReloadKey((prev) => prev + 1);
  };

  return (
    <>
      {/* Main Content */}
      <main className="min-h-screen bg-[#EBF5F8] py-6 sm:py-10 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Add Product Button - full width on mobile */}
          <div className="flex justify-end padding-bottom-2">
            <div className="w-full sm:w-auto">
              <AddProductButton onProductAdded={handleProductAdded} />
            </div>
          </div>

          {/* Data Table - scrollable on small screens */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
            <div className="overflow-x-auto">
              {/* 3. Pass the key to DataTable */}
              <DataTable reloadKey={reloadKey} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
