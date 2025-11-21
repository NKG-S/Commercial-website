import { useState, useEffect } from "react";
import { Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    image: "/default_user.jpg",
  });

  const [profileImage, setProfileImage] = useState(user.image);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setProfileImage(parsed.image || "/default_user.jpg");
    }
    setIsLoading(false);
  }, []);

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setProfileImage(newImage);
        // Optionally update localStorage immediately
        const updatedUser = { ...user, image: newImage };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage (or send to backend via API)
    const updatedUser = {
      ...user,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      image: profileImage,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profile updated successfully!");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  }

  return (
    <section className="py-10 min-h-screen bg-gray-900">
      <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
        <div className="lg:w-[88%] xs:w-full mx-auto shadow-2xl p-6 rounded-2xl h-fit self-center bg-gray-800/40 backdrop-blur-xl border border-gray-700">
          <div className="relative">
            {/* Cover Image */}
            <div
              className="h-48 w-full rounded-t-2xl bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')`,
              }}
            >
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <label htmlFor="upload_cover" className="cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Camera className="w-5 h-5" />
                  <span>Change Cover</span>
                </label>
                <input type="file" id="upload_cover" hidden accept="image/*" />
              </div>
            </div>

            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-gray-900 overflow-hidden shadow-2xl">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="upload_profile"
                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 cursor-pointer shadow-xl transition-all transform hover:scale-110"
                >
                  <Camera className="w-5 h-5" />
                </label>
                <input
                  type="file"
                  id="upload_profile"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-20 px-6 pb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Profile</h1>
            <p className="text-gray-400 text-sm mb-8">Update your personal information</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={user.firstName}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={user.lastName}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email (Read-only)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-indigo-500/40 transform hover:scale-105 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Role: <span className="font-semibold text-indigo-400 capitalize">{user.role || "customer"}</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}