'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Bed, Bath, ChevronLeft, Maximize, Edit, Trash2, Eye, Plus, Search, Filter, Tag, ChevronRight, Compass, LandPlot, Monitor, DoorClosed, Presentation } from "lucide-react";
import ApiService from '../../hooks/ApiService';
import PropertyForm from '../../components/PropertyForm';
import getPhotoSrc from '../../hooks/getPhotos';

function ManageListingsContent() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [clientDetails, setClientDetails] = useState(null);

  // Fixed Sold Out Overlay - No height increase
  const SoldOutOverlay = ({ isSold, children }) => {
    if (!isSold) return children;

    return (
      <div className="relative w-full h-full">
        {children}
        {/* Clean SOLD badge only - no overlay that affects height */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-red-600 text-white px-3 py-1 rounded-md shadow-lg border-2 border-white">
            <span className="text-xs font-bold uppercase tracking-wider">
              SOLD
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Fetch listings from API (only client's properties)
  const fetchListings = async () => {
    try {
      const clientToken = localStorage.getItem("token");
      
      // Fetch dashboard data to get client's properties
      const response = await ApiService.get('/dashboard/client', {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Manage Listings API Response:", response);

      // Access nested response.data.data safely
      if (response?.data) {
        const data = response.data;
        const properties = data.properties || [];
        
        // Store client details
        localStorage.setItem("clientDetails", JSON.stringify(data.clientDetails));
        setClientDetails(data.clientDetails);
        
        setListings(properties);
        setFilteredListings(properties);
        setTotalItems(properties.length);
      } else {
        console.warn("Unexpected response format:", response);
        setListings([]);
        setFilteredListings([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
      setFilteredListings([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchListings();
  }, []);

  // Filter logic (search + status)
  useEffect(() => {
    let filtered = listings;

    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing?.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing?.address?.locality?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'sold') {
        filtered = filtered.filter((listing) => listing?.isSold === true);
      } else {
        filtered = filtered.filter((listing) => listing?.status === filterStatus);
      }
    }

    setFilteredListings(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filterStatus, listings]);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredListings.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  // Handle Delete
  const handleDelete = (listing) => {
    setSelectedListing(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedListing) return;

    const clientToken = localStorage.getItem('token');
    try {
      const response = await ApiService.delete(`properties/${selectedListing?.id}`, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response) {
        throw new Error('Failed to delete property');
      }

      // Remove deleted property from list
      const updatedListings = listings.filter((l) => l.id !== selectedListing?.id);
      setListings(updatedListings);
      setFilteredListings(prev => prev.filter((l) => l.id !== selectedListing?.id));
      setShowDeleteModal(false);
      setSelectedListing(null);
      
      // Adjust current page if needed
      const newTotalItems = updatedListings.length;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      alert("Property deleted successfully!");
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete property. Please try again.');
    }
  };

  // Handle Edit - Store listing in sessionStorage (clean URL)
  const handleEdit = (listing) => {
    // Store full listing data in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('editProperty', JSON.stringify(listing));
    }
    // Only pass the ID in URL
    router.push(`/post-property?edit=${listing.id}`);
  };

  const handleUpdateProperty = async (formData) => {
    console.log("from::", formData);

    try {
      const adminToken = localStorage.getItem("token");

      const response = await ApiService.put(`/properties/${formData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response) {
        setShowEditModal(false);
        router.push('/vendor/manage-listings');
      } else {
        console.log("rrr::", response?.message);
      }
      fetchListings();
      setShowEditModal(false);
      setEditingProperty(null);
      alert("Property updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSold = async (id) => {
    if (typeof window !== 'undefined' && window.confirm(
      "Are you sure you want to mark as SOLD this property? This action cannot be undone."
    )) {
      const clientToken = localStorage.getItem('token');
      try {
        const res = await ApiService.put(`/properties/${id}`, { isSold: true }, {
          headers: {
            Authorization: `Bearer ${clientToken}`,
            "Content-Type": "application/json"
          }
        });
        if (res) {
          alert("Property marked as SOLD successfully!");
          fetchListings();
        }
      } catch (err) {
        alert("Failed to update property status.");
      }
    }
  };

  const handleViewDetails = (listing) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedProperty', JSON.stringify(listing));
    }
    router.push(`/property/${listing.slug}`);

  };

  const handleAddNewListing = () => {
    const clientDetailsStr = localStorage.getItem("clientDetails");
    const clientDetailsObj = clientDetailsStr ? JSON.parse(clientDetailsStr) : null;
    const postLimit = clientDetailsObj?.postLimit || 0;
    const propertyCount = listings.length || 0;

    if (propertyCount < postLimit) {
      router.push('/post-property');
    } else {
      alert("Sorry, your post limit is over");
    }
  };

  const currentItems = getCurrentPageItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Listings</h1>
            <p className="text-gray-600 mt-2">
              View and manage all your property listings
            </p>
          </div>
          <button
            onClick={handleAddNewListing}
            className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add New Listing
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="verified">Verified</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
            Loading listings...
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-gray-600">
                  Showing{' '}
                  <span className="font-semibold text-gray-900">
                    {startItem} - {endItem}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900">
                    {totalItems}
                  </span>{' '}
                  listings
                </p>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {currentItems?.map((listing) => (
                <div key={listing?.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image with Fixed Sold Out Overlay */}
                    <div className="w-full lg:w-64 h-48 flex-shrink-0 relative">
                      <SoldOutOverlay isSold={listing?.isSold}>
                        <img
                          src={getPhotoSrc(listing.photos)}
                          alt={listing?.title}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                      </SoldOutOverlay>
                    </div>
                   
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {listing?.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {listing?.address?.city}-{listing?.address?.locality}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-orange-600">
                            ₹{listing?.price ? listing.price.toLocaleString('en-IN') : "Contact For Price"}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-medium ${
                            listing?.isSold
                              ? 'bg-red-100 text-red-700'
                              : listing?.status === 'verified'
                                ? 'bg-green-100 text-green-700'
                                : listing?.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : listing?.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {listing?.isSold ? 'Sold' : listing?.status?.charAt(0).toUpperCase() + listing?.status?.slice(1) || 'Unknown'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {listing?.profile && (
                          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 flex-wrap">
                            {listing.profile.bedrooms > 0 && (
                              <div className="flex items-center gap-1">
                                <Bed size={16} className="text-[#003366]" />
                                <span>{listing.profile.bedrooms}</span>
                              </div>
                            )}
                            {listing.profile.bathrooms > 0 && (
                              <div className="flex items-center gap-1">
                                <Bath size={16} className="text-[#003366]" />
                                <span>{listing.profile.bathrooms}</span>
                              </div>
                            )}
                            {listing.profile.carpetArea > 0 && (
                              <div className="flex items-center gap-1">
                                <Maximize size={16} className="text-[#003366]" />
                                <span>
                                  {listing.profile.carpetArea} {listing.profile.areaUnit}
                                </span>
                              </div>
                            )}
                            {listing.profile.plotArea > 0 && (
                              <div className="flex items-center gap-1">
                                <Maximize size={16} className="text-[#003366]" />
                                <span>
                                  {listing.profile.plotArea} {listing.profile.areaUnit}
                                </span>
                              </div>
                            )}
                            {listing.profile.facing && (
                              <div className="flex items-center gap-1">
                                <Compass size={16} className="text-[#003366]" />
                                <span>{listing.profile.facing}</span>
                              </div>
                            )}
                            {listing.profile.workstations > 0 && (
                              <div className="flex items-center gap-1">
                                <Monitor size={16} className="text-[#003366]" />
                                <span>{listing.profile.workstations}</span>
                              </div>
                            )}
                            {listing.profile.cabins > 0 && (
                              <div className="flex items-center gap-1">
                                <DoorClosed size={16} className="text-[#003366]" />
                                <span>{listing.profile.cabins}</span>
                              </div>
                            )}
                            {listing.profile.conferenceRooms > 0 && (
                              <div className="flex items-center gap-1">
                                <Presentation size={16} className="text-[#003366]" />
                                <span>{listing.profile.conferenceRooms}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(listing)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>

                        <button 
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          onClick={() => handleViewDetails(listing)}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>

                        {(!listing.isSold && listing.status === "verified") && (
                          <button
                            onClick={() => handleSold(listing.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            <Tag className="w-4 h-4" />
                            Mark as Sold
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No listings found
                </h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pagination Component */}
            {totalItems > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {startItem} to {endItem} of {totalItems} listings
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border transition-colors ${
                        currentPage === 1
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {/* Page Numbers */}
                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border transition-colors ${
                        currentPage === totalPages
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "
              {selectedListing?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-900">Edit Property</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProperty(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Plus className="w-5 h-5 text-gray-500 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <PropertyForm
                initialData={editingProperty}
                onSubmit={handleUpdateProperty}
                onCancel={() => {
                  setShowEditModal(false);
                  setEditingProperty(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// Wrap with Suspense for App Router
export default function ManageListings() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <ManageListingsContent />
    </Suspense>
  );
}