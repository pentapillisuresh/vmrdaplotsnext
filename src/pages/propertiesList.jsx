'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Home, MapPin, Bath, Bed, Maximize,
  ChevronLeft, ChevronRight,
  Compass,
  Monitor,
  DoorClosed,
  Presentation,
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
        const res = await ApiService.get(`/properties/?${params.toString()}`);
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
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading properties...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003366] to-[#004d99] text-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-white hover:text-orange-400 mb-6"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
          <h1 className="text-4xl font-bold mb-2">
            {category?.name || "Properties"}
          </h1>
          <p className="text-blue-100">{category?.description}</p>
          <p className="text-sm text-blue-200 mt-1">
            {filteredProperties.length} Properties Found
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <h3 className="text-xl font-bold text-[#003366] mb-4">Filters</h3>

            {/* Market Type */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Market Type
              </label>
              <select
                name="marketType"
                value={filters.marketType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            
            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select
                value={filters.categoryId}
                onChange={handleChange}
                name="categoryId"
                className="border rounded-lg px-3 py-2 text-sm w-full"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* City Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">City</label>
              <select
                name="city"
                value={filters.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select City</option>
                {cities?.map((c) => (
                  <option key={c.id} value={c.city}>
                    {c.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Locality Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Locality
              </label>
              <select
                name="locality"
                value={filters.locality}
                onChange={handleChange}
                disabled={!filters.city}
                className={`w-full px-3 py-2 border rounded-lg ${!filters.city ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <option value="">
                  {filters.city ? "Select Locality" : "Select City first"}
                </option>
                {localities?.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Price Range
              </label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="all">All Prices</option>
                <option value="0-5000000">Under ₹50 Lac</option>
                <option value="5000000-10000000">₹50 Lac - ₹1 Cr</option>
                <option value="10000000-20000000">₹1 Cr - ₹2 Cr</option>
                <option value="20000000-99999999">Above ₹2 Cr</option>
              </select>
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Apply Filters */}
            <button
              onClick={applyFilters}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Property List */}
        <main className="flex-1">
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">
                No properties found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
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
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

/* PROPERTY CARD – Updated to use new API structure */
function PropertyCard({ property, formatPrice, onPropertyClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Photos: array of URLs from the response
  const media = property.photos || [];

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % media.length);
  };
  
  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + media.length) % media.length);
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
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border cursor-pointer"
      onClick={() => onPropertyClick(property)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-96 flex-shrink-0 group">
          <div className="w-full aspect-[4/3] bg-gray-100 relative overflow-hidden">
            {media.length > 0 ? (
              <img
                src={media[currentIndex]}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
          {media.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-[#003366] mb-2">
            {property.title}
          </h2>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={16} className="text-orange-500 mr-1" />
            {fullAddress || 'Address not available'}
          </div>

          {property.price ? (
            <div className="text-xl font-bold text-orange-600">
              {priceDisplay}
            </div>
          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-md transition-all"
              onClick={(e) => {
                e.stopPropagation();
                alert("Contact us for price!");
              }}
            >
              Contact Us for Price
            </button>
          )}

          {/* Display additional info */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            {categoryName && (
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                {categoryName}
              </span>
            )}
            {property.availableStatus && (
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                {property.availableStatus}
              </span>
            )}
            {property.approvedBy && (
              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
                {property.approvedBy}
              </span>
            )}
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {amenities.slice(0, 4).map((item, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {item}
                </span>
              ))}
              {amenities.length > 4 && (
                <span className="text-gray-500 text-xs">+{amenities.length - 4} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// Wrap with Suspense for App Router
export default function PropertiesList() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading properties...
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}