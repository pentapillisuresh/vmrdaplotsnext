'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import areaData from '../data/areaData';
import { ArrowLeft, MapPin, TrendingUp, IndianRupee, Home, Target, Check } from 'lucide-react';

function AreaDetailContent() {
  const router = useRouter();
  const params = useParams();
  const areaName = params?.areaName;
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!areaName) return;
    
    // Convert URL parameter back to area name
    const formattedName = areaName
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const foundArea = areaData.find(a => 
      a.name.toLowerCase() === formattedName.toLowerCase()
    );
    
    setArea(foundArea);
    setLoading(false);
  }, [areaName]);

  // Investment reasons based on area name
  const getInvestmentReasons = (areaName) => {
    const reasons = {
      "Madhurawada": [
        "Rapid Development Area (fastest-growing areas in Visakhapatnam)",
        "IT & Educational Hub (near to IT SEZs, software companies)",
        "Excellent Connectivity (good road connectivity to NH-16)",
        "High Appreciation Potential (population and development)",
        "Growing Infrastructure (schools, colleges, hospitals, shopping centers, and entertainment zones)",
        "Safe Long-Term Investment",
        "Near to highway"
      ],
      "Kommadi": [
        "Prime Location Near Madhurawada (very close to Madhurawada)",
        "Excellent Connectivity (Easy access to NH-16, IT SEZs)",
        "High Demand Residential Area (families, IT professionals)",
        "Well-Planned Layouts (approved layouts, wide roads, proper drainage)",
        "Close to Educational Institutions & Hospitals",
        "Safe Long-Term Investment",
        "Near to highway"
      ],
      "Rushikonda": [
        "Prime Coastal Location (very close to highway)",
        "Very close to IT SEZ",
        "High-End Residential Demand (professionals, NRIs, and luxury home buyers)",
        "Excellent Connectivity (IT SEZs, Vizag city, and NH-16)",
        "Tourism & Lifestyle Advantage",
        "Close to IT Hub & Educational Institutions",
        "Safe & Prestigious Investment"
      ],
      "Kapuluppada": [
        "Strategic Location Near Madhurawada & Bheemili",
        "Close to IT & Educational Zones",
        "Excellent Road Connectivity (NH-16, Madhurawada, Rushikonda, and Vizag city)",
        "Emerging Residential Hub",
        "Peaceful & Green Surroundings",
        "Growing Social Infrastructure (Schools, hospitals, supermarkets)",
        "Near to highway"
      ],
      "Anandapuram": [
        "Near to International Airport and Highway",
        "Excellent Connectivity (Madhurawada, IT SEZs, Rushikonda, Bheemili, and NH-16)",
        "Upcoming Infrastructure Projects (Flyovers, widened roads)",
        "Large Approved Layouts Available",
        "Ideal for Long-Term Investment",
        "Peaceful Living Environment",
        "Good Resale & Future Construction Value"
      ],
      "Bheemili": [
        "Near to Hospitals, Schools, Market, Road",
        "Near to Highway",
        "Near to International Airport",
        "Beautiful Coastal Location",
        "High Lifestyle & Second-Home Demand",
        "Excellent Road Connectivity (Anandapuram, Madhurawada, and Rushikonda)",
        "Tourism Development Boost",
        "Peaceful & Pollution-Free Environment",
        "Safe Long-Term Investment"
      ],
      "Tagarapuvalasa": [
        "Very Close to International Highway",
        "Very Close to Bhogapuram International Airport",
        "Very Close to Schools, Hospitals, Market",
        "Strategic Location on NH-16",
        "Rapid Infrastructure Development (Flyovers, road expansions)",
        "Growing Residential & Commercial Demand",
        "Close to Anandapuram & Bheemili",
        "Ideal for Long-Term Investment"
      ],
      "Bhogapuram": [
        "Upcoming International Airport",
        "High Future Appreciation Potential",
        "Strategic Location (Vizianagaram, Srikakulam, and NH-16)",
        "Rapid Infrastructure Development (Roads, commercial zones, and supporting infrastructure)",
        "Future Commercial & Residential Hub (hotels, warehouses, apartments near airport)",
        "Very Close to Schools, Hospitals, Market",
        "Very Close to Highway",
        "Affordable Plot Prices",
        "Peaceful & Open Environment"
      ],
      "Boyapalem": [
        "Close to Upcoming Bhogapuram Airport",
        "Excellent Connectivity (Easy access to NH-16)",
        "Affordable Plot Prices",
        "High Appreciation Potential (With airport-related development)",
        "Ideal for Long-Term Investment",
        "Peaceful & Open Environment",
        "Future Commercial Opportunities",
        "Good Resale Demand in Future"
      ],
      "Polipalli": [
        "Upcoming Bhogapuram Airport Proximity",
        "Excellent Connectivity – Close to NH-16; easy road access to Visakhapatnam & Vizianagaram",
        "Affordable Prices",
        "High Appreciation Potential – Airport and infrastructure developments",
        "Long-Term Investment",
        "Peaceful & Open Environment",
        "Future Commercial Opportunities – Potential for warehouses, hotels, and commercial ventures near airport",
        "Good Resale Potential",
        "Very Close to Highway",
        "Very Close to Schools, Hospitals, Market etc"
      ]
    };
    return reasons[areaName] || [];
  };

  // Function to handle keyword click - navigate to projects page
  const handleKeywordClick = (keyword) => {
    // Store search params in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('searchParams', JSON.stringify({
        searchKeyword: keyword,
        areaName: area.name
      }));
    }
    router.push('/project');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F3F]"></div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-3xl font-bold text-[#001F3F] mb-4">Area not found</h1>
        <Link href="/" className="text-[#001F3F] hover:text-orange-500 font-medium">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const investmentReasons = getInvestmentReasons(area.name);

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center text-[#001F3F] hover:text-orange-500 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to All Areas
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={area.image}
          alt={area.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-[#001F3F] text-white text-sm font-semibold px-4 py-2 rounded-full">
                  {area.areaType}
                </span>
                <span className={`text-sm font-semibold px-4 py-2 rounded-full ${
                  area.demand === 'Very High' ? 'bg-red-500' :
                  area.demand === 'High' ? 'bg-orange-500' :
                  area.demand === 'Medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}>
                  {area.demand} Demand
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{area.name}</h1>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-2" />
                <p className="text-lg">{area.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#001F3F] text-white p-4 rounded-xl text-center">
              <IndianRupee className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-sm text-gray-300">Average Price</p>
              <p className="text-xl font-bold text-white">{area.avgPrice}</p>
            </div>
            <div className="bg-orange-500 text-white p-4 rounded-xl text-center">
              <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-sm text-gray-300">Annual Growth</p>
              <p className="text-xl font-bold text-white">{area.growth}</p>
            </div>
            <div className="bg-[#001F3F] text-white p-4 rounded-xl text-center">
              <Home className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-sm text-gray-300">Best For</p>
              <p className="text-xl font-bold text-white">{area.bestFor}</p>
            </div>
            <div className="bg-orange-500 text-white p-4 rounded-xl text-center">
              <Target className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-sm text-gray-300">Investment Potential</p>
              <p className="text-xl font-bold text-white">{area.demand}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#001F3F] mb-4">About {area.name}</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">{area.description}</p>
            </div>
          </div>

          {/* Search Keywords - Clickable to navigate to projects */}
          <div className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {area.keywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleKeywordClick(keyword)}
                  className="flex items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-200 transition-all duration-300 group hover:border-orange-300 hover:shadow-md cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:ring-opacity-50"
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-6 h-6 rounded-full bg-[#001F3F] flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#001F3F] font-medium text-sm group-hover:text-orange-600 transition-colors line-clamp-2">
                      {keyword}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-500 italic">
              Click on any keyword to explore related projects
            </div>
          </div>

          {/* Investment Analysis */}
          <div className="bg-[#001F3F] rounded-2xl p-6 mb-10 text-white">
            <h2 className="text-2xl font-bold mb-6">Why Invest in {area.name}?</h2>
            <div className="space-y-4">
              <ul className="space-y-3">
                {investmentReasons.map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-orange-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nearby Areas */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Explore Nearby Areas</h2>
            <div className="flex flex-wrap gap-3">
              {areaData
                .filter(a => a.id !== area.id)
                .slice(0, 4)
                .map(nearbyArea => (
                  <Link
                    key={nearbyArea.id}
                    href={`/area/${nearbyArea.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-gray-100 hover:bg-orange-100 text-[#001F3F] hover:text-orange-600 px-4 py-2 rounded-full transition-all duration-300 border border-gray-300"
                  >
                    {nearbyArea.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#001F3F] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">Ready to Invest in {area.name}?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get exclusive access to VMRDA-approved plots, expert guidance, and special pricing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-500 text-white hover:bg-orange-600 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                Book Site Visit
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-full transition-all duration-300">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for App Router
export default function AreaDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F3F]"></div>
      </div>
    }>
      <AreaDetailContent />
    </Suspense>
  );
}