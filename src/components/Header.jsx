'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Home, BarChart3, User, LogOut, Users, Heart } from "lucide-react";
import SearchBar from "../hooks/searchBar";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVendorMenuOpen, setIsVendorMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setSearchKey] = useState(0);

  const searchRef = useRef(null);
  const vendorMenuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLogin');
      const clientDataStr = localStorage.getItem('clientData');
      const clientDetailsStr = localStorage.getItem('clientDetails');

      setIsLogin(loginStatus === 'true');

      if (loginStatus === 'true') {
        try {
          let clientData = null;
          if (clientDataStr) {
            clientData = JSON.parse(clientDataStr);
          } else if (clientDetailsStr) {
            clientData = JSON.parse(clientDetailsStr);
          }
          setProfileData(clientData);
        } catch (error) {
          console.error('Error parsing client data:', error);
          setProfileData(null);
        }
      } else {
        setProfileData(null);
      }
    };

    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setProfileData(event.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdate', handleProfileUpdate);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkLoginStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdate', handleProfileUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }

      if (vendorMenuRef.current && !vendorMenuRef.current.contains(event.target)) {
        setIsVendorMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchResults([]);
  }, [pathname]);

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('clientData');
    localStorage.removeItem('clientDetails');
    localStorage.removeItem('token');
    setIsLogin(false);
    setProfileData(null);
    setIsVendorMenuOpen(false);
    router.push("/login-register");
  };

  const clientDashboards = () => {
    if (isLogin) {
      router.push('/vendor/dashboard');
    } else {
      router.push("/login-register");
    }
  };

  const handleVendorMenuToggle = () => {
    setIsVendorMenuOpen(!isVendorMenuOpen);
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    setIsVendorMenuOpen(false);
    setIsSearchOpen(false);
    setSearchResults([]);
    setSearchKey(prevKey => prevKey + 1);
    router.push(path);
  };

  const handleSearchToggle = () => {
    const newSearchState = !isSearchOpen;
    setIsSearchOpen(newSearchState);

    if (newSearchState) {
      setIsVendorMenuOpen(false);
      setIsMobileMenuOpen(false);
      setSearchResults([]);
      setSearchKey(prevKey => prevKey + 1);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchResults([]);
    setSearchKey(prevKey => prevKey + 1);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/blog", label: "Blog" },
    { path: "/project", label: "Projects" },
    { path: "/properties", label: "Properties" }
  ];

  const vendorMenuItems = [
    { path: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/vendor/manage-listings", label: "Manage Listings", icon: Home },
    { path: "/vendor/leads", label: "Leads", icon: Users },
    { path: "/vendor/profile", label: "Profile", icon: User },
    { path: "/vendor/favorites", label: "Favorites", icon: Heart }
  ];

  return (
    <div ref={searchRef} className="w-full">
      <header className="shadow-sm bg-gray-50 relative z-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Main Header Container */}
          <div className="flex items-center justify-between h-20 w-full mx-auto">
            
            {/* Left Section: Logo */}
            <div className="flex items-center flex-shrink-0">
              <img
                src="/images/logo6.png"
                alt="vmrdaplots Logo"
                className="h-16 sm:h-18 md:h-20 w-auto cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onClick={() => router.push("/")}
              />
            </div>

            {/* Middle Section: Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-2">
                {navItems.map(({ path, label }) => (
                  <button
                    key={path}
                    onClick={() => handleNavigation(path)}
                    className={`relative font-medium font-roboto transition-all duration-300 px-4 py-2 rounded-full transform hover:scale-105 ${
                      isActive(path)
                        ? "text-white bg-orange-500 shadow-md scale-105"
                        : "text-gray-700 bg-white hover:text-orange-500 hover:bg-orange-50 border border-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Right Section: Action Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
              {/* Buy Button */}
              <button
                onClick={handleSearchToggle}
                className={`${
                  isSearchOpen ? "bg-orange-600" : "bg-orange-500"
                } text-white font-roboto px-4 py-2 rounded-full hover:bg-orange-600 transition-all duration-300 flex items-center space-x-2 shadow-md transform hover:scale-105 active:scale-95 whitespace-nowrap`}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isSearchOpen ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Buy Property</span>
              </button>

              {/* Sell Button */}
              <button
                onClick={() => {
                  clientDashboards();
                  setIsSearchOpen(false);
                  setSearchResults([]);
                }}
                className="bg-orange-100 text-orange-600 font-roboto px-4 py-2 rounded-full hover:bg-orange-200 transition-all duration-300 flex items-center space-x-2 border border-orange-400 shadow-md transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-300 hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Sell Property</span>
              </button>

              {/* Vendor/Login Menu */}
              <div className="relative" ref={vendorMenuRef}>
                <button
                  onClick={() => {
                    handleVendorMenuToggle();
                    setIsSearchOpen(false);
                    setSearchResults([]);
                  }}
                  className="bg-orange-500 text-white font-roboto px-4 py-2 rounded-full hover:bg-orange-600 transition-all duration-300 flex items-center space-x-2 min-w-[100px] max-w-[140px] justify-center shadow-md transform hover:scale-105 active:scale-95"
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {isLogin && profileData?.fullName ? profileData.fullName.split(' ')[0] : "Login"}
                  </span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transform transition-transform duration-300 ${
                      isVendorMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Vendor Menu Dropdown */}
                {isVendorMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    <div className="py-2">
                      {isLogin ? (
                        <>
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {profileData?.fullName || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {profileData?.email || ""}
                            </p>
                          </div>
                          {vendorMenuItems.map(({ path, label, icon: Icon }) => (
                            <button
                              key={path}
                              onClick={() => handleNavigation(path)}
                              className="w-full text-left px-4 py-3 flex items-center text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                            >
                              <Icon className="w-4 h-4 mr-3" />
                              {label}
                            </button>
                          ))}
                          <hr className="my-1 border-gray-200" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 flex items-center text-red-500 hover:bg-red-50 transition-all duration-200"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleNavigation("/login-register")}
                          className="w-full text-left px-4 py-3 flex items-center text-orange-600 hover:bg-orange-50 transition-all duration-200"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Login / Register
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700 p-2 transform transition-transform duration-300 hover:scale-110 active:scale-95"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsSearchOpen(false);
                setSearchResults([]);
              }}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out">
            <div className="px-4 py-3 space-y-2">
              {/* Mobile Navigation Links */}
              {navItems.map(({ path, label }) => (
                <button
                  key={path}
                  onClick={() => handleNavigation(path)}
                  className={`w-full text-left font-medium font-roboto transition-all duration-300 py-2 px-3 rounded-full ${
                    isActive(path)
                      ? "text-white bg-orange-500"
                      : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  {label}
                </button>
              ))}

              {/* Mobile Action Buttons */}
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                <button
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left font-roboto py-2.5 px-3 rounded-full flex items-center space-x-2 ${
                    isSearchOpen
                      ? "text-white bg-orange-600"
                      : "text-white bg-orange-500"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Buy Property</span>
                </button>

                <button
                  onClick={() => {
                    clientDashboards();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left font-roboto py-2.5 px-3 rounded-full flex items-center space-x-2 bg-orange-100 text-orange-600 border border-orange-400"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Sell Property</span>
                </button>

                {/* Mobile Vendor Menu */}
                <div className="pt-2">
                  {isLogin ? (
                    <>
                      <div className="px-3 py-2 mb-2 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">
                          Welcome, {profileData?.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {profileData?.email || ""}
                        </p>
                      </div>
                      {vendorMenuItems.map(({ path, label, icon: Icon }) => (
                        <button
                          key={path}
                          onClick={() => handleNavigation(path)}
                          className="w-full text-left py-2.5 px-3 rounded-lg flex items-center text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {label}
                        </button>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-2.5 px-3 rounded-lg flex items-center text-red-500 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavigation("/login-register")}
                      className="w-full text-left py-2.5 px-3 rounded-full flex items-center text-orange-600 bg-orange-50 hover:bg-orange-100"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Login / Register
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Bar Section */}
      {isSearchOpen && (
        <div className="bg-white border-b border-gray-200 shadow-sm w-full transform transition-all duration-500 ease-in-out">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <SearchBar setResults={setSearchResults} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;