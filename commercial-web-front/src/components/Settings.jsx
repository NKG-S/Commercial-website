import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function Settings() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const URL = "http://localhost:3000";

  // Function to handle profile deletion
  const handleDeleteProfile = async () => {
    // 1. Confirmation Dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!isConfirmed) return;

    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      
      const response = await fetch(`${URL}/api/user/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Ensure your backend middleware expects "Bearer " + token
        },
      });

      if (response.ok) {
        // 3. Cleanup Local Storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        alert("Account deleted successfully.");
        
        // 4. Redirect to Login
        navigate("/login");
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("An error occurred while deleting the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header />
        <div className="min-h-screen bg-slate-900 pt-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 border-b border-white/10 pb-4">Settings</h1>

            {/* General Settings Section (Placeholder) */}
            <div className="mb-10">
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">General Preferences</h2>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <p className="text-gray-400 text-sm">Application settings like notifications and theme would go here.</p>
            </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
            <div className="bg-red-500/5 rounded-lg p-6 border border-red-500/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-medium text-white">Delete Account</h3>
                    <p className="text-sm text-gray-400 mt-1">
                    Permanently remove your account, personal data, and profile picture.
                    This action is not reversible.
                    </p>
                </div>
                
                <button
                    onClick={handleDeleteProfile}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isLoading ? "Deleting..." : "Delete Profile"}
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </>
    
  );
}