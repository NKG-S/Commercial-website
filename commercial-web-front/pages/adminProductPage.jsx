// AdminProductPage.jsx
import React, { useState } from "react";
import Header from "../src/components/Header.jsx";
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
      <Header />

      {/* Main Content */}
      <div className="min-h-screen bg-[#EBF5F8] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 3. Pass the key to DataTable */}
          <DataTable reloadKey={reloadKey} />
          
          {/* 4. Pass the callback to AddProductButton */}
          <AddProductButton onProductAdded={handleProductAdded} />
           
        </div>
      </div>
    </>
  );
};