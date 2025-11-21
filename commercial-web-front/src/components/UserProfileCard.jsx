// commercial-web-front/src/components/UserProfileCard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Camera, Edit, X, Save, User, Mail, Shield, Calendar } from "lucide-react";

// Import your Supabase functions
import { uploadProfilePicture, deleteImageFromSupabase } from "../utils/SupabaseUploader";
import Header from "./Header";
const URL = "http://localhost:3000";
const API_URL = `${URL}/api/user/profile`; 

export default function UserProfileCard() {
  // --- 1. State Management ---
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    image: "",
    createdAt: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); // Actual File object
  const [previewImage, setPreviewImage] = useState(null); // Preview URL
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 2. Fetch Data on Mount ---
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        // No token found, handle gracefully
        setIsLoading(false);
        return;
      }

      // Call the NEW GET endpoint
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      
      // If 401/403, token might be expired
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Session expired. Please login again.");
        // Optional: window.location.href = "/login";
      } else {
        toast.error("Failed to load profile data");
      }
      setIsLoading(false);
    }
  };

  // --- 3. Modal Handlers ---

  const handleEditClick = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email, // Read-only
    });
    setPreviewImage(user.image); 
    setSelectedFile(null); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  // --- 4. Update Logic ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      toast.error("First name and Last name are required");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const token = localStorage.getItem("token");
      let finalImageUrl = user.image; 

      // STEP A: Handle Image Upload
      if (selectedFile) {
        toast.loading("Uploading new image...", { id: toastId });

        // 1. Upload new image
        const newImageUrl = await uploadProfilePicture(selectedFile);
        finalImageUrl = newImageUrl;

        // 2. Delete old image from Supabase
        if (user.image) {
           await deleteImageFromSupabase(user.image);
        }
      }

      // STEP B: Prepare Payload
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        image: finalImageUrl,
      };

      // STEP C: Send Update to Backend (PUT request)
      toast.loading("Saving changes...", { id: toastId });
      
      const response = await axios.put(API_URL, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // STEP D: Update UI
      const updatedUser = response.data.user || response.data; 
      setUser(prev => ({ ...prev, ...updatedUser }));
      
      // Update localStorage if your app uses it for persistence
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...localUser, ...updatedUser }));

      toast.success("Profile updated successfully!", { id: toastId });
      setIsModalOpen(false);

    } catch (error) {
      console.error("Update Error:", error);
      const errorMsg = error.response?.data?.message || "Update failed";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 5. Render ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const displayImage = user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <>
    <Header />
        <section className="py-10 min-h-screen bg-gray-900 font-sans">
            <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto">
                
                {/* Main Card */}
                <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl overflow-hidden">
                
                {/* Cover Image */}
                <div 
                    className="h-60 w-full bg-cover bg-center relative"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')` }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="px-8 pb-8 relative">
                    {/* Profile Image & Edit Button */}
                    <div className="-mt-20 mb-6 flex flex-wrap justify-between items-end gap-4">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full border-4 border-gray-900 overflow-hidden shadow-2xl bg-gray-700">
                        <img
                            src={displayImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleEditClick}
                        className="mb-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </button>
                    </div>

                    {/* User Details */}
                    <div className="grid gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-1 capitalize">
                        {user.firstName} {user.lastName}
                        </h1>
                        <div className="flex items-center gap-2 text-indigo-400 font-medium mb-6">
                        <Shield className="w-4 h-4" />
                        <span className="uppercase tracking-wider text-xs">{user.role || "Customer"}</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 border-t border-gray-700 pt-6">
                        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition">
                        <div className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email Address
                        </div>
                        <div className="text-white font-medium truncate">{user.email}</div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition">
                        <div className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Member Since
                        </div>
                        <div className="text-white font-medium">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* --- EDIT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="bg-gray-800 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                    
                    <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <button 
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    </div>

                    <form onSubmit={handleUpdate} className="p-6 space-y-6">
                    
                    {/* Image Upload */}
                    <div className="flex items-center gap-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                        <div className="relative group w-24 h-24 flex-shrink-0">
                        <img 
                            src={previewImage || displayImage} 
                            alt="Preview" 
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-600 group-hover:border-indigo-500 transition" 
                        />
                        <label 
                            htmlFor="modal_upload" 
                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-all text-white backdrop-blur-sm"
                        >
                            <Camera className="w-6 h-6" />
                        </label>
                        <input 
                            type="file" 
                            id="modal_upload" 
                            hidden 
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                        </div>
                        <div className="flex-1">
                        <p className="text-white font-medium">Profile Photo</p>
                        <p className="text-sm text-gray-400 mb-2">Click the image to change.</p>
                        {selectedFile && (
                            <span className="inline-block text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20">
                            New image selected
                            </span>
                        )}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                        <label className="text-sm text-gray-400 flex items-center gap-2"><User className="w-3 h-3"/> First Name</label>
                        <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        />
                        </div>

                        <div className="space-y-2">
                        <label className="text-sm text-gray-400 flex items-center gap-2"><User className="w-3 h-3"/> Last Name</label>
                        <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName || ""}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 flex items-center gap-2">
                        <Mail className="w-3 h-3"/> Email Address 
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">Read Only</span>
                        </label>
                        <input 
                        type="email" 
                        name="email"
                        value={formData.email || ""}
                        disabled
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed select-none"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-700 mt-2">
                        <button 
                        type="button"
                        onClick={handleCloseModal}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 font-medium transition disabled:opacity-50"
                        >
                        Cancel
                        </button>
                        <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-70"
                        >
                        {isSubmitting ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            )}
        </section>
    </>
  );
}