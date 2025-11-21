import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

// Helper function to check the authentication status from localStorage
const checkAuthStatus = () => {
  // We check for the presence of the 'token' item as the most reliable 
  // indicator of a logged-in user session.
  return !!localStorage.getItem("token");
};

const navLinks = [
  { name: "Home", to: "/home" },
  { name: "Products", to: "/product" },
  { name: "Admin", to: "/admin" },
];

export default function Header(props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuthStatus());

  const navigate = useNavigate();

  // Function to toggle the mobile menu state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  // Function to toggle the profile dropdown state
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
    navigate("/login");
  };

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
    <nav className="relative bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-indigo-900/60 backdrop-blur-xl border-b border-white/10">
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
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>

              {/* Hamburger Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className={`size-6 ${isMobileMenuOpen ? "hidden" : "block"}`}
              >
                <path
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Close Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className={`size-6 ${isMobileMenuOpen ? "block" : "hidden"}`}
              >
                <path
                  d="M6 18 18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Logo + Desktop Nav */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <Link
                to="/home"
                className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 hover:bg-white/10 transition"
              >
                <img
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                  className="h-6 w-auto"
                />
                <span className="text-sm font-semibold text-white tracking-tight hidden xs:inline">
                  YourApp
                </span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-2">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={desktopLinkClasses}
                    end
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: Notifications + Auth */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Notification Button */}
            <button
              type="button"
              className="relative rounded-full p-1 text-gray-400 hover:text-white hover:bg-white/5 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">View notifications</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="size-6"
              >
                <path
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Auth section */}
            {isLoggedIn ? (
              // Profile Dropdown
              <div className="relative ml-3">
                <button
                  onClick={toggleProfileMenu}
                  type="button"
                  className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                    className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
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
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => navigate("/profile" || "/home")}
                    >
                      Your profile
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => navigate("/settings" || "/home")}
                    >
                      Settings
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Sign In Button
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
      <div
        className={`sm:hidden border-t border-white/10 ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
        id="mobile-menu"
      >
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
