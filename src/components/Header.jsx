'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Home, BarChart3, User, LogOut, Users, Heart, Menu, X, Search, Plus, Building2, Phone, Info, Newspaper, Briefcase } from "lucide-react";
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
    { path: "/", label: "Home", icon: Home },
    { path: "/properties", label: "Properties", icon: Building2 },
    { path: "/project", label: "Projects", icon: Briefcase },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Phone },
    { path: "/blog", label: "Blog", icon: Newspaper },
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
      <header className="bg-white shadow-md border-b border-gray-200 relative z-50 w-full">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Main Header Container */}
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 w-full">
            
            {/* Left Section: Logo */}
            <div className="flex items-center flex-shrink-0">
              <img
                src="/images/logo6.png"
                alt="vmrdaplots Logo"
                className="h-12 sm:h-14 md:h-16 w-auto cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onClick={() => router.push("/")}
              />
            </div>

            {/* Middle Section: Desktop Navigation */}
            <nav className="hidden xl:flex items-center justify-center flex-1 px-4">
              <div className="flex items-center space-x-1">
                {navItems.map(({ path, label }) => (
                  <button
                    key={path}
                    onClick={() => handleNavigation(path)}
                    className={`relative font-semibold font-roboto text-sm transition-all duration-300 px-4 py-2 rounded-full transform hover:scale-105 whitespace-nowrap ${
                      isActive(path)
                        ? "text-white bg-orange-500 shadow-md scale-105"
                        : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                    }`}
                  >
                    {label}
                    {isActive(path) && (
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full"></span>
                    )}
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
                } text-white font-semibold font-roboto text-sm px-5 py-2 rounded-full hover:bg-orange-600 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 whitespace-nowrap`}
              >
                <Search className={`w-4 h-4 transition-transform duration-300 ${isSearchOpen ? "rotate-90" : ""}`} />
                <span>Buy Property</span>
              </button>

              {/* Sell Button */}
              <button
                onClick={() => {
                  clientDashboards();
                  setIsSearchOpen(false);
                  setSearchResults([]);
                }}
                className="bg-orange-100 text-orange-600 font-semibold font-roboto text-sm px-5 py-2 rounded-full hover:bg-orange-200 transition-all duration-300 flex items-center space-x-2 border-2 border-orange-300 hover:border-orange-400 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <Building2 className="w-4 h-4" />
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
                  className={`${
                    isVendorMenuOpen 
                      ? "bg-orange-600 text-white" 
                      : "bg-orange-500 text-white"
                  } font-semibold font-roboto text-sm px-5 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 min-w-[100px] max-w-[140px] justify-center shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95`}
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
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="py-2">
                      {isLogin ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100 bg-orange-50">
                            <p className="text-sm font-semibold text-gray-800 truncate">
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
                              className="w-full text-left px-4 py-3 flex items-center text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                            >
                              <Icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-orange-500" />
                              <span className="text-sm font-medium">{label}</span>
                            </button>
                          ))}
                          <hr className="my-1 border-gray-100" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 flex items-center text-red-500 hover:bg-red-50 transition-all duration-200 group"
                          >
                            <LogOut className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-500" />
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleNavigation("/login-register")}
                          className="w-full text-left px-4 py-3 flex items-center text-orange-600 hover:bg-orange-50 transition-all duration-200 group"
                        >
                          <User className="w-4 h-4 mr-3 text-orange-400 group-hover:text-orange-500" />
                          <span className="text-sm font-medium">Login / Register</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 active:scale-95"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsSearchOpen(false);
                setSearchResults([]);
              }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl transform transition-all duration-300 ease-in-out">
            <div className="px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
              {/* Mobile Navigation Links */}
              {navItems.map(({ path, label, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => handleNavigation(path)}
                  className={`w-full text-left font-semibold font-roboto transition-all duration-300 py-3 px-4 rounded-full ${
                    isActive(path)
                      ? "text-white bg-orange-500 shadow-md"
                      : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </div>
                </button>
              ))}

              {/* Mobile Action Buttons */}
              <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
                <button
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left font-semibold font-roboto py-3 px-4 rounded-full flex items-center space-x-3 ${
                    isSearchOpen
                      ? "text-white bg-orange-600"
                      : "text-white bg-orange-500"
                  }`}
                >
                  <Search className="w-5 h-5" />
                  <span>Buy Property</span>
                </button>

                <button
                  onClick={() => {
                    clientDashboards();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left font-semibold font-roboto py-3 px-4 rounded-full flex items-center space-x-3 bg-orange-100 text-orange-600 border-2 border-orange-300 hover:bg-orange-200"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Sell Property</span>
                </button>

                {/* Mobile Vendor Menu */}
                <div className="pt-2">
                  {isLogin ? (
                    <>
                      <div className="px-4 py-3 mb-2 bg-orange-50 rounded-xl">
                        <p className="text-sm font-semibold text-gray-800">
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
                          className="w-full text-left py-3 px-4 rounded-full flex items-center text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-3 px-4 rounded-full flex items-center text-red-500 hover:bg-red-50 transition-all duration-200"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavigation("/login-register")}
                      className="w-full text-left py-3 px-4 rounded-full flex items-center text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all duration-200"
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span className="text-sm font-medium">Login / Register</span>
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
        <div className="bg-white border-b border-gray-200 shadow-md w-full transform transition-all duration-500 ease-in-out">
          <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
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