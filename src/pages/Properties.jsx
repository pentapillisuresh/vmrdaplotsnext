'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Home, MapPin, Bath, Bed, Maximize,
  ChevronLeft, ChevronRight,
  Filter,
  Search,
  X,
  ChevronDown,
  Building2,
  DollarSign,
  ArrowUpDown,
  Tag,
  Award,
  Clock,
  TrendingUp,
  Play,
  Image as ImageIcon,
  Video
} from "lucide-react";
import ApiService from "../hooks/ApiService";

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get filters from URL query params
  const categoryIdFromUrl = searchParams.get('categoryId');
  const cityFromUrl = searchParams.get('city');
  const localityFromUrl = searchParams.get('locality');
  const priceRangeFromUrl = searchParams.get('priceRange');
  
  const [categories, setCategories] = useState([])
  // States
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // City & Locality dropdowns
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    categoryId: categoryIdFromUrl || "",
    marketType: "sale",
    status: "",
    city: cityFromUrl || "",
    locality: localityFromUrl || "",
    clientId: "",
    priceRange: priceRangeFromUrl || "all",
  });

  const [activeFilters, setActiveFilters] = useState(filters);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ApiService.get('/categories', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response?.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch Cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await ApiService.get("/city", {
          headers: { "Content-Type": "application/json" },
        });
        setCities(res);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Populate localities when city changes
  useEffect(() => {
    if (filters.city && cities.length > 0) {
      const selectedCity = cities.find(
        (c) => c.city.toLowerCase() === filters.city.toLowerCase()
      );
      setLocalities(selectedCity ? selectedCity.locality : []);
      if (!selectedCity || !Array.isArray(selectedCity.locality)) {
        setLocalities([]);
        setFilters(prev => ({ ...prev, locality: "" }));
      } else if (!selectedCity.locality.includes(filters.locality)) {
        setFilters(prev => ({ ...prev, locality: "" }));
      }
    }
  }, [filters.city, cities]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeFilters.categoryId) params.set('categoryId', activeFilters.categoryId);
    if (activeFilters.city) params.set('city', activeFilters.city);
    if (activeFilters.locality) params.set('locality', activeFilters.locality);
    if (activeFilters.priceRange && activeFilters.priceRange !== 'all') params.set('priceRange', activeFilters.priceRange);
    
    const queryString = params.toString();
    const newUrl = queryString ? `/properties?${queryString}` : '/properties';
    router.replace(newUrl);
  }, [activeFilters, router]);

  // Fetch Properties (core)
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", 10);

        const {
          categoryId,
          marketType,
          status,
          city,
          locality,
          clientId,
          priceRange,
        } = activeFilters;

        if (categoryId) params.append("categoryId", categoryId);
        params.append("marketType", marketType || "sale");
        if (status) params.append("status", status);
        if (city) params.append("city", city);
        if (locality) params.append("locality", locality);
        if (clientId) params.append("clientId", clientId);

        // Price Range
        if (priceRange !== "all") {
          const [min, max] = priceRange.split("-").map(Number);
          if (!isNaN(min)) params.append("minPrice", min);
          if (!isNaN(max)) params.append("maxPrice", max);
        }

        // API Call
        const res = await ApiService.get(`/properties/searchProperty/?${params.toString()}`);
        // New response: { status: true, message: "...", count: 3, data: [...] }
        const data = res?.data || [];
        const total = res?.count || data.length;

        let sorted = [...data];
        switch (sortBy) {
          case "price-low":
            sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
          case "price-high":
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
          case "newest":
          default:
            sorted.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
        }

        setFilteredProperties(sorted);
        setTotalPages(Math.ceil(total / 10));
        setCategory({
          name: "All Properties",
          description: "Explore our property listings",
        });
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [activeFilters, sortBy, page]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPage(1);
    setActiveFilters(filters);
  };

  const formatPrice = (price) => {
    const num = parseFloat(price);
    if (isNaN(num)) return "₹0";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    return `₹${(num / 100000).toFixed(2)} Lac`;
  };

  // Handle property click
  const handlePropertyClick = (property) => {
    sessionStorage.setItem('selectedProperty', JSON.stringify(property));
    router.push(`/property/${property.slug}`);
  };

  // UI
  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading properties...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-orange-500 hover:text-orange-600 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#001F3F] via-[#002D5C] to-[#003366] text-white py-12 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-300 mb-4"
          >
            <Home size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 font-serif">
                {category?.name || "Properties"}
              </h1>
              <p className="text-blue-200 text-lg">{category?.description}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Award className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-medium">
                {filteredProperties.length} Properties Found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Compact Premium Design */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl p-4 sticky top-6 border border-gray-100/80 max-h-[calc(100vh-3rem)] overflow-y-auto">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg shadow-orange-200">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Filters</h3>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                {Object.values(activeFilters).filter(v => v && v !== 'all' && v !== 'sale' && v !== 'rent').length}
              </span>
            </div>

            {/* Market Type */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-orange-500" />
                Market Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, marketType: "sale" }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    filters.marketType === "sale"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  For Sale
                </button>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, marketType: "rent" }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    filters.marketType === "rent"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  For Rent
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-orange-500" />
                Category
              </label>
              <div className="relative">
                <select
                  value={filters.categoryId}
                  onChange={handleChange}
                  name="categoryId"
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:bg-white focus:outline-none transition-all duration-300 appearance-none pr-8"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* City Dropdown */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                City
              </label>
              <div className="relative">
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:bg-white focus:outline-none transition-all duration-300 appearance-none pr-8"
                >
                  <option value="">All Cities</option>
                  {cities?.map((c) => (
                    <option key={c.id} value={c.city}>
                      {c.city}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Locality Dropdown */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                Locality
              </label>
              <div className="relative">
                <select
                  name="locality"
                  value={filters.locality}
                  onChange={handleChange}
                  disabled={!filters.city}
                  className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:border-orange-500 focus:bg-white focus:outline-none transition-all duration-300 appearance-none pr-8 ${
                    !filters.city 
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <option value="">
                    {filters.city ? "All Localities" : "Select City First"}
                  </option>
                  {localities?.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                {filters.city && (
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                Price Range
              </label>
              <div className="relative">
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:bg-white focus:outline-none transition-all duration-300 appearance-none pr-8"
                >
                  <option value="all">All Prices</option>
                  <option value="0-5000000">Under ₹50 Lac</option>
                  <option value="5000000-10000000">₹50 Lac - ₹1 Cr</option>
                  <option value="10000000-20000000">₹1 Cr - ₹2 Cr</option>
                  <option value="20000000-99999999">Above ₹2 Cr</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-orange-500" />
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:bg-white focus:outline-none transition-all duration-300 appearance-none pr-8"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={applyFilters}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md shadow-orange-200 hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Apply Filters
            </button>

            {/* Active Filters Display */}
            {Object.values(activeFilters).some(v => v && v !== 'all' && v !== 'sale' && v !== 'rent') && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Active:</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeFilters.categoryId && (
                    <span className="inline-flex items-center gap-0.5 bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium border border-orange-200">
                      {categories.find(c => c.id === activeFilters.categoryId)?.name || activeFilters.categoryId}
                      <button onClick={() => {
                        setFilters(prev => ({ ...prev, categoryId: "" }));
                        setActiveFilters(prev => ({ ...prev, categoryId: "" }));
                      }} className="hover:text-orange-900 transition-colors">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  )}
                  {activeFilters.city && (
                    <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-200">
                      {activeFilters.city}
                      <button onClick={() => {
                        setFilters(prev => ({ ...prev, city: "", locality: "" }));
                        setActiveFilters(prev => ({ ...prev, city: "", locality: "" }));
                      }} className="hover:text-blue-900 transition-colors">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  )}
                  {activeFilters.locality && (
                    <span className="inline-flex items-center gap-0.5 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200">
                      {activeFilters.locality}
                      <button onClick={() => {
                        setFilters(prev => ({ ...prev, locality: "" }));
                        setActiveFilters(prev => ({ ...prev, locality: "" }));
                      }} className="hover:text-green-900 transition-colors">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  )}
                  {activeFilters.priceRange && activeFilters.priceRange !== 'all' && (
                    <span className="inline-flex items-center gap-0.5 bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium border border-purple-200">
                      {activeFilters.priceRange === '0-5000000' && 'Under ₹50 Lac'}
                      {activeFilters.priceRange === '5000000-10000000' && '₹50 Lac - ₹1 Cr'}
                      {activeFilters.priceRange === '10000000-20000000' && '₹1 Cr - ₹2 Cr'}
                      {activeFilters.priceRange === '20000000-99999999' && 'Above ₹2 Cr'}
                      <button onClick={() => {
                        setFilters(prev => ({ ...prev, priceRange: "all" }));
                        setActiveFilters(prev => ({ ...prev, priceRange: "all" }));
                      }} className="hover:text-purple-900 transition-colors">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Property List */}
        <main className="flex-1">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                {filteredProperties.length} Properties
              </h2>
              <p className="text-xs text-gray-500">Showing properties matching your criteria</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated recently</span>
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No properties found</h3>
                <p className="text-gray-500 text-sm mb-3">
                  Try adjusting your filters to find what you're looking for
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      categoryId: "",
                      marketType: "sale",
                      status: "",
                      city: "",
                      locality: "",
                      clientId: "",
                      priceRange: "all",
                    });
                    setActiveFilters({
                      categoryId: "",
                      marketType: "sale",
                      status: "",
                      city: "",
                      locality: "",
                      clientId: "",
                      priceRange: "all",
                    });
                  }}
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  formatPrice={formatPrice}
                  onPropertyClick={handlePropertyClick}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProperties.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-1.5 rounded-lg border transition-all duration-300 flex items-center gap-1.5 text-xs font-medium ${
                    page === 1
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </button>
                <div className="flex items-center gap-1.5">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all duration-300 ${
                            page === pageNum
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                              : "text-gray-600 hover:bg-gray-100 hover:text-orange-500"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`px-4 py-1.5 rounded-lg border transition-all duration-300 flex items-center gap-1.5 text-xs font-medium ${
                    page === totalPages
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* PROPERTY CARD – Premium Design with Video Support */
function PropertyCard({ property, formatPrice, onPropertyClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Parse photos - handle both array and string
  let media = [];
  try {
    if (Array.isArray(property?.photos)) {
      media = property.photos;
    } else if (typeof property?.photos === 'string') {
      media = JSON.parse(property.photos) || [];
    } else {
      media = [];
    }
  } catch (e) {
    media = [];
  }

  // Parse videos - handle string URL or array
  let videoUrls = [];
  try {
    if (property?.videos) {
      if (typeof property.videos === 'string') {
        // Check if it's a JSON array or a single URL
        if (property.videos.startsWith('[')) {
          videoUrls = JSON.parse(property.videos) || [];
        } else {
          // Single video URL
          videoUrls = [property.videos];
        }
      } else if (Array.isArray(property.videos)) {
        videoUrls = property.videos;
      }
    }
  } catch (e) {
    videoUrls = [];
  }

  // Combine media: photos first, then videos
  const allMedia = [...media, ...videoUrls];
  const hasVideo = videoUrls.length > 0;
  const totalMedia = allMedia.length;

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % totalMedia);
  };
  
  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + totalMedia) % totalMedia);
  };

  const isVideo = (index) => {
    return index >= media.length && hasVideo;
  };

  const getMediaUrl = (index) => {
    if (index < media.length) {
      return media[index];
    } else {
      const videoIndex = index - media.length;
      return videoUrls[videoIndex];
    }
  };

  // Get address components
  const address = property.address || {};
  const city = address.city || '';
  const locality = address.locality || '';
  const fullAddress = [locality, city].filter(Boolean).join(', ');

  // Get category name
  const categoryName = property.category?.name || '';

  // Get amenities
  const amenities = property.amenities || [];

  // Price display
  const priceDisplay = property.price ? formatPrice(property.price) : 'Contact Us';

  return (
    <article
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 cursor-pointer overflow-hidden"
      onClick={() => onPropertyClick(property)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-[280px] lg:w-[320px] flex-shrink-0 group/image">
          <div className="w-full aspect-[4/3] bg-gray-100 relative overflow-hidden">
            {totalMedia > 0 ? (
              <>
                {isVideo(currentIndex) ? (
                  <video
                    src={getMediaUrl(currentIndex)}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                    loop
                    onClick={(e) => {
                      e.stopPropagation();
                      const video = e.target;
                      if (video.paused) {
                        video.play();
                      } else {
                        video.pause();
                      }
                    }}
                  />
                ) : (
                  <img
                    src={getMediaUrl(currentIndex)}
                    alt={property.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                )}
              </>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            {/* Badges - No Text */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
              {property.availableStatus && (
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-lg"></span>
              )}
              {property.approvedBy && (
                <span className="w-2 h-2 bg-blue-500 rounded-full shadow-lg"></span>
              )}
            </div>

            {/* Video Badge */}
            {hasVideo && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg flex items-center justify-center">
                  <Play className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>

          {totalMedia > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-all duration-300 opacity-0 group-hover/image:opacity-100"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-all duration-300 opacity-0 group-hover/image:opacity-100"
              >
                <ChevronRight size={14} />
              </button>
            </>
          )}

          {/* Media Counter */}
          {totalMedia > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              {isVideo(currentIndex) ? (
                <Video className="w-2.5 h-2.5" />
              ) : (
                <ImageIcon className="w-2.5 h-2.5" />
              )}
              {currentIndex + 1}/{totalMedia}
            </div>
          )}
        </div>

        <div className="flex-1 p-4 lg:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors duration-300 line-clamp-1">
              {property.title}
            </h2>
            {property.price ? (
              <div className="text-lg font-bold text-orange-600 whitespace-nowrap">
                {priceDisplay}
              </div>
            ) : null}
          </div>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={14} className="text-orange-500 mr-1 flex-shrink-0" />
            <span className="text-xs">{fullAddress || 'Address not available'}</span>
          </div>

          {!property.price && (
            <button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs px-4 py-1.5 rounded-lg shadow-md shadow-orange-200 transition-all duration-300 transform hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                alert("Contact us for price!");
              }}
            >
              Contact Us
            </button>
          )}

          {/* Property Details */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {categoryName && (
              <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-orange-200">
                {categoryName}
              </span>
            )}
            {property.bedrooms && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border border-blue-200">
                <Bed className="w-2.5 h-2.5" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms && (
              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border border-purple-200">
                <Bath className="w-2.5 h-2.5" />
                {property.bathrooms}
              </span>
            )}
            {property.area && (
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border border-green-200">
                <Maximize className="w-2.5 h-2.5" />
                {property.area}
              </span>
            )}
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100">
              {amenities.slice(0, 4).map((item, idx) => (
                <span key={idx} className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-medium border border-gray-200">
                  {item}
                </span>
              ))}
              {amenities.length > 4 && (
                <span className="text-gray-400 text-[10px] font-semibold px-1 py-0.5">
                  +{amenities.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// Wrap with Suspense for App Router
export default function Properties() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}