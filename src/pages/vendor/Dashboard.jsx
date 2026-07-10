'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Home, TrendingUp, Eye, Phone, Heart, Store } from 'lucide-react';
import ApiService from '../../hooks/ApiService';
import getPhotoSrc from '../../hooks/getPhotos';

function DashboardContent() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalInquiries: 0,
    monthlyViews: 0
  });
  const [filteredListings, setFilteredListings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [recentListings, setRecentListings] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientDetails, setClientDetails] = useState(null);

  const fetchDashboardData = async () => {
    const clientToken = localStorage.getItem("token");

    try {
      const response = await ApiService.get('/dashboard/client', {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Dashboard API Response:", response);

      if (response?.data) {
        const data = response.data;

        setStats({
          totalListings: data.addedPropertiesCount || 0,
          activeListings: data.verifiedPropertiesCount || 0,
          totalViews: data.totalViews || 0,
          totalInquiries: data.Inquiries || 0,
          monthlyViews: data.totalThisMonthViews || 0
        });
        localStorage.setItem("clientDetails", JSON.stringify(data.clientDetails));
        setClientDetails(data.clientDetails);

        const properties = data.properties || [];
        setRecentListings(properties);
        setFilteredListings(properties);
        setRecentLeads(data.leads || []);
      } else {
        console.warn("Unexpected response format:", response);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFilter = (filterType) => {
    setActiveFilter(filterType);

    if (filterType === "verified") {
      setFilteredListings(recentListings.filter(listing => listing.status === "verified"));
    } else if (filterType === "pending") {
      setFilteredListings(recentListings.filter(listing => listing.status === "pending"));
    } else {
      setFilteredListings(recentListings);
    }
  };

  const handlePostProperty = async () => {
    await fetchDashboardData();
    const clientDetailsStr = localStorage.getItem("clientDetails");
    const clientDetailsObj = clientDetailsStr ? JSON.parse(clientDetailsStr) : null;
    const postLimit = clientDetailsObj?.postLimit || 0;
    const propertyCount = stats.totalListings || 0;

    if (propertyCount < postLimit) {
      router.push("/post-property");
    } else {
      alert("Sorry, your post limit is over");
    }
  };

  const handlePropertyClick = (listing) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedProperty', JSON.stringify(listing));
    }
    router.push(`/property/${listing.slug}`);
  };

  const StatCard = ({ icon: Icon, title, value, change, color, onClick, className }) => (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${className || ""}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! <span style={{ textTransform: 'capitalize', color: "ThreeDHighlight", fontWeight: 'bold', fontSize: 18, marginLeft: 5, marginRight: 5 }}>
              {clientDetails?.fullName}
            </span> Here's what's happening with your properties.
          </p>
        </div>

        {/* Add Property CTA */}
        <div className="mt-8 mb-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Ready to add more properties?</h3>
              <p className="text-orange-100 mt-1">Reach more buyers by listing your properties with us</p>
            </div>
            <button
              onClick={handlePostProperty}
              className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Post New Property
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Home}
            title="Total Listings"
            value={stats.totalListings}
            color="bg-blue-500"
            onClick={() => handleFilter("all")}
            className="cursor-pointer"
          />
          <StatCard
            icon={TrendingUp}
            title="Verified Listings"
            value={stats.activeListings}
            color="bg-green-500"
            onClick={() => handleFilter("verified")}
            className="cursor-pointer"
          />
          <StatCard
            icon={Store}
            title="Pending Listings"
            value={parseInt(stats.totalListings) - parseInt(stats.activeListings)}
            color="bg-yellow-500"
            onClick={() => handleFilter("pending")}
            className="cursor-pointer"
          />
          <StatCard
            icon={Phone}
            title="Inquiries"
            value={stats.totalInquiries}
            color="bg-purple-500"
          />
          <StatCard
            icon={Eye}
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            color="bg-orange-500"
          />
          <StatCard
            icon={TrendingUp}
            title="This Month Views"
            value={stats.monthlyViews.toLocaleString()}
            color="bg-indigo-500"
          />
        </div>

        {/* Listings + Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Listings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Listings</h2>
                <button
                  onClick={() => router.push('/vendor/manage-listings')}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  View All →
                </button>
              </div>

              {filteredListings.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No properties found.</p>
              ) : (
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <div
                      key={listing._id || listing.id}
                      className={`relative flex items-center gap-4 p-4 border rounded-lg transition-all cursor-pointer ${listing.isSold
                          ? "bg-gray-100 border-red-200 opacity-80"
                          : "border-gray-200 hover:border-orange-300"
                        }`}
                      onClick={() => handlePropertyClick(listing)}
                    >
                      {/* Sold / Available Badge */}
                      <span
                        className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md ${listing.isSold ? "bg-red-600" : "bg-green-600"
                          }`}
                      >
                        {listing.isSold ? "Sold" : "Available"}
                      </span>
                      <img
                        src={getPhotoSrc(listing.photos)}
                        alt={listing.title || 'Property'}
                        className={`w-24 h-24 object-cover rounded-lg ${listing.isSold ? "grayscale" : ""
                          }`}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{listing.title || 'Untitled Property'}</h3>
                        <p className="text-sm text-gray-600">
                          {listing.category?.name || 'No location'} <span>{listing.address?.city || 'No location'}</span>
                        </p>
                        <p className="text-orange-600 font-bold mt-1">{listing.price || 'Contact Us'}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${listing.status === 'active' || listing.status === 'verified'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {listing.status || 'pending'}
                        </span>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {listing.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {listing.inquiries || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Leads</h2>

              {recentLeads.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No leads found.</p>
              ) : (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead._id || lead.id}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div
                        className={`p-2 rounded-full ${lead.type === 'inquiry'
                            ? 'bg-orange-100'
                            : lead.type === 'view'
                              ? 'bg-blue-100'
                              : 'bg-red-100'
                          }`}
                      >
                        {lead.type === 'inquiry' ? (
                          <Phone className="w-4 h-4 text-orange-600" />
                        ) : lead.type === 'view' ? (
                          <Eye className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Heart className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{lead.message || 'Lead activity'}</p>
                        <p className="text-xs text-gray-500 mt-1">{lead.time || 'Just now'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for App Router
export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}