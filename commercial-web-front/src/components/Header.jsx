import { useState } from "react";

// Helper function to check the authentication status from localStorage
const checkAuthStatus = () => {
  // We check for the presence of the 'token' item as the most reliable 
  // indicator of a logged-in user session.
  return !!localStorage.getItem('token');
};

export default function Header(props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Check the logged-in status once on component load
  const isLoggedIn = checkAuthStatus(); 

  // Function to toggle the mobile menu state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close profile menu if mobile menu is opened/closed
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  // Function to toggle the profile dropdown state
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    // Close mobile menu if profile menu is opened/closed
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* GLASSY EFFECT APPLIED: 
        bg-gray-800/30: Reduced opacity background
        backdrop-blur-lg: Key class for the frosted glass look
      */}
      <nav className="relative bg-gray-800/30 backdrop-blur-lg relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile menu button wrapper */}
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
                  className={`size-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`}
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
                  className={`size-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                >
                  <path
                    d="M6 18 18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Logo and Desktop Nav Links */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              {/* Logo */}
              <div className="flex shrink-0 items-center">
                <img
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                  className="h-8 w-auto"
                />
              </div>
              {/* Desktop Links */}
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {/* The links should ideally be dynamically mapped */}
                  <a
                    href="#"
                    aria-current="page"
                    className="rounded-md bg-gray-950/50 px-3 py-2 text-sm font-medium text-white"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    Team
                  </a>
                  <a
                    href="#"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    Projects
                  </a>
                  <a
                    href="#"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    Calendar
                  </a>
                </div>
              </div>
            </div>

            {/* Notifications and Profile Dropdown */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Notification Button (Always shown) */}
              <button
                type="button"
                className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
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

              {/* Conditional Rendering: Profile Dropdown or Sign In Button */}
              {isLoggedIn ? (
                // --- Profile Dropdown (If Logged In) ---
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
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                      className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                        role="menuitem"
                        tabIndex="-1"
                      >
                        Your profile
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                        role="menuitem"
                        tabIndex="-1"
                      >
                        Settings
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                        role="menuitem"
                        tabIndex="-1"
                        onC
                      >
                        Sign out
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                // --- Sign In Button (If Logged Out) ---
                <a 
                    href="/login" // You might want to update this link
                    className="ml-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Sign In
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {/* The links should ideally be dynamically mapped */}
            <a
              href="#"
              aria-current="page"
              className="block rounded-md bg-gray-950/50 px-3 py-2 text-base font-medium text-white"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Team
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Projects
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Calendar
            </a>
            {/* Conditional Mobile Sign Out/Sign In Link (Optional but good practice) */}
            {!isLoggedIn && (
                <a
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-indigo-400 hover:bg-white/5 hover:text-white"
                >
                  Sign In
                </a>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}