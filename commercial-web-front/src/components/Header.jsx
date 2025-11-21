import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; // Removed Bell icon

export default function Header() {
  const navigate = useNavigate();

  // --- State Management ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Load auth state and user data from localStorage
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : {};
  
  const isLoggedIn = !!token;
  const isAdmin = user?.role === "admin";

  // --- Dynamic Links ---
  const allLinks = [
    { name: "Home", to: "/home" },
    { name: "Products", to: "/product" },
    { name: "Category", to: "/category" },
    { name: "Contact Us", to: "/contact" },
    { name: "Admin", to: "/admin" },
  ];

  // Filter links: Show "Admin" only if user has admin role
  const navLinks = allLinks.filter((link) => {
    if (link.name === "Admin") {
      return isAdmin;
    }
    return true;
  });

  // Determine Profile Image
  const profileImage =
    user.image ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // --- Handlers ---
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsProfileMenuOpen(false);
    navigate("/login");
    window.location.reload();
  };

  // --- Styles ---
  const desktopLinkClasses = ({ isActive }) =>
    [
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-indigo-600/80 text-white shadow-sm"
        : "text-gray-300 hover:bg-white/5 hover:text-white",
    ].join(" ");

  const mobileLinkClasses = ({ isActive }) =>
    [
      "block rounded-md px-3 py-2 text-base font-medium transition-colors",
      isActive
        ? "bg-indigo-600/80 text-white shadow-sm"
        : "text-gray-300 hover:bg-white/5 hover:text-white",
    ].join(" ");

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-indigo-900/90 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={`w-6 h-6 ${isMobileMenuOpen ? "hidden" : "block"}`}>
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Close Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={`w-6 h-6 ${isMobileMenuOpen ? "block" : "hidden"}`}>
                <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Logo + Desktop Nav */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <Link to="/home" className="flex items-center gap-2 rounded bg-white/5 px-3 py-1.5 hover:bg-white/10 transition">
                <ShoppingCart className="h-6 w-6 text-indigo-400" />
                <span className="text-sm font-semibold text-white tracking-tight hidden xs:inline">
                  i-com
                </span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-2">
                {navLinks.map((item) => (
                  <NavLink key={item.to} to={item.to} className={desktopLinkClasses} end>
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: Cart + Auth */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

            {/* NEW: Cart Button (replaces Notification) */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="relative rounded-full p-1 text-gray-400 hover:text-white hover:bg-white/5 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <ShoppingCart className="w-6 h-6" />
            </button>

            {/* Auth section */}
            {isLoggedIn ? (
              <div className="relative ml-3">
                <button
                  onClick={toggleProfileMenu}
                  type="button"
                  className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    src={profileImage}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10 object-cover"
                  />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-slate-900/95 py-1 shadow-xl ring-1 ring-black/40 backdrop-blur-md"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs text-indigo-400 font-semibold uppercase">{user.role || "User"}</p>
                      <p className="text-sm text-white truncate">{user.firstName} {user.lastName}</p>
                    </div>

                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
                      role="menuitem"
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      Your Profile
                    </button>

                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
                      role="menuitem"
                      onClick={() => {
                        navigate("/settings");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      Settings
                    </button>

                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                      role="menuitem"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-3 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden border-t border-white/10 ${isMobileMenuOpen ? "block" : "hidden"}`} id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={mobileLinkClasses}
              end
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}

          {!isLoggedIn && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                [
                  "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                  isActive
                    ? "bg-indigo-600/80 text-white shadow-sm"
                    : "text-indigo-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}