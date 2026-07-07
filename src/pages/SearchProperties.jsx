'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ Next.js navigation
import { Home, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import ApiService from "../hooks/ApiService";

function Properties() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔹 Read categoryId & categoryName from URL query params (e.g. ?categoryId=1&categoryName=Residential)
  const categoryIdFromUrl = searchParams.get("categoryId") || "";
  const categoryNameFromUrl = searchParams.get("categoryName") || "";

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Filter form – initialise with URL categoryId if present
  const [filters, setFilters] = useState({
    categoryId: categoryIdFromUrl,
    marketType: "sale",
    status: "",
    city: "",
    locality: "",
    clientId: "",
    priceRange: "all",
  });

  const [activeFilters, setActiveFilters] = useState(filters);

  // 🔹 Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", 10);

        const { categoryId, marketType, status, city, locality, clientId, priceRange } =
          activeFilters;

        if (categoryId) params.append("categoryId", categoryId);
        if (marketType) params.append("marketType", marketType);
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

        // ✅ API call – use relative path (base URL should be configured in ApiService)
        const res = await ApiService.get(`/api/properties?${params.toString()}`);

        const data = res?.properties || [];
        const total = res?.totalPages || data.length;

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
          name: categoryNameFromUrl || "All Properties",
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
  }, [activeFilters, sortBy, page, categoryNameFromUrl]);

  // 🔹 Filter form handling
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
            onClick={() => router.push("/")} // ✅ Next.js navigation
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
                <option value="">All</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            {/* City & Locality */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleChange}
                placeholder="e.g. Vizag"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Locality
              </label>
              <input
                type="text"
                name="locality"
                value={filters.locality}
                onChange={handleChange}
                placeholder="e.g. Allipuram"
                className="w-full px-3 py-2 border rounded-lg"
              />
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

/* PROPERTY CARD */
function PropertyCard({ property, formatPrice }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  let media = [];
  try {
    media = JSON.parse(property.photos) || [];
  } catch {
    media = [];
  }
  const nextSlide = () => setCurrentIndex((i) => (i + 1) % media.length);
  const prevSlide = () => setCurrentIndex((i) => (i - 1 + media.length) % media.length);

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border">
      <div className="flex flex-col md:flex-row">
        {/* Media */}
        <div className="relative md:w-96 flex-shrink-0 group">
          <div className="w-full aspect-[4/3] bg-gray-100 relative overflow-hidden">
            {media.length > 0 ? (
              <img
                src={media[currentIndex]}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          {media.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-[#003366] mb-2">
            {property.title}
          </h2>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={16} className="text-orange-500 mr-1" />
            {property.address?.locality}, {property.address?.city}
          </div>
          <p className="text-sm text-gray-600 mb-3">{property.description}</p>
          {property?.price ? (
            <div className="text-xl font-bold text-orange-600">
              {formatPrice(property.price)}
            </div>
          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-md transition-all"
              onClick={() => alert("Contact us for price!")}
            >
              Contact Us for Price
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default Properties;