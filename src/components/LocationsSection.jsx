'use client';

import React, { useEffect, useState, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Home, Users, Handshake, ChevronDown, ChevronUp, MapPin, Building2, Award } from "lucide-react";
import { useRouter } from "next/navigation";

const LocationsSection = ({ cityLocalities }) => {
  const router = useRouter();
  const [expandedCards, setExpandedCards] = useState({});
  const [visibleLocations, setVisibleLocations] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const toggleAreas = (city) => {
    setExpandedCards((prev) => ({
      ...prev,
      [city]: !prev[city],
    }));
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    if (cityLocalities && cityLocalities.length > 0) {
      // Show only first 10 locations initially
      if (showAll) {
        setVisibleLocations(cityLocalities);
      } else {
        setVisibleLocations(cityLocalities.slice(0, 10));
      }
    }
  }, [cityLocalities, showAll]);

  // Handle navigation with URL query parameters (App Router way)
  const handleAreaClick = (city, locality) => {
    // Build URL with query parameters
    const params = new URLSearchParams();
    params.set('city', city);
    params.set('locality', locality);
    router.push(`/properties-list?${params.toString()}`);
  };

  const handleExploreAllClick = () => {
    router.push("/properties-list");
  };

  const toggleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider mx-4">Locations</span>
            <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            Properties by Locality
          </h2>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            Explore properties in the most popular areas across Vizag & Vizianagaram
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Locations Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {visibleLocations && visibleLocations.map((location, idx) => {
            const areas = location.localities || [];
            const displayAreas = expandedCards[location.city] 
              ? areas 
              : areas.slice(0, 10);
            const hasMoreAreas = areas.length > 10;

            return (
              <div 
                key={location.city || idx} 
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-orange-300 transform hover:-translate-y-1 group"
                data-aos="fade-up"
                data-aos-delay={idx * 50 + 100}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 group-hover:bg-orange-500 transition-colors duration-300 flex items-center justify-center mr-3">
                    <MapPin className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors duration-300">
                    {location.city}
                  </h3>
                  <span className="ml-auto text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {areas.length} Areas
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5 text-gray-700 leading-relaxed">
                    {displayAreas.map((area, index) => (
                      <React.Fragment key={index}>
                        <span
                          className="hover:text-orange-500 cursor-pointer transition-all duration-300 text-sm text-gray-600 px-2.5 py-1 rounded-full hover:bg-orange-50 hover:shadow-sm"
                          onClick={() => handleAreaClick(location.city, area)}
                        >
                          {area}
                        </span>
                        {index < displayAreas.length - 1 && (
                          <span className="text-gray-300 text-xs">•</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* View More/Less Areas Button per City */}
                  {hasMoreAreas && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleAreas(location.city)}
                        className="text-orange-500 font-medium text-sm hover:text-orange-600 transition-all duration-300 flex items-center gap-1.5 hover:scale-105"
                      >
                        {expandedCards[location.city] ? (
                          <>
                            <span>View Less</span>
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>View More ({areas.length - 10} more)</span>
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View More/Less Locations Button */}
        {cityLocalities && cityLocalities.length > 10 && (
          <div
            className="text-center mt-12"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <button
              onClick={toggleViewAll}
              className="group inline-flex items-center space-x-3 bg-white text-orange-500 px-10 py-4 rounded-full font-semibold text-base border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
            >
              <span>
                {showAll 
                  ? 'View Less Locations' 
                  : `View More Locations (${cityLocalities.length - 10} more)`}
              </span>
              {showAll ? (
                <ChevronUp className="w-5 h-5 transition-transform duration-300" />
              ) : (
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
              )}
            </button>
            <p className="text-sm text-gray-500 mt-3 font-medium">
              {showAll 
                ? `Showing all ${cityLocalities.length} locations` 
                : `Showing ${Math.min(10, cityLocalities.length)} of ${cityLocalities.length} locations`}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div
          className="text-center mt-12"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          <button 
            onClick={handleExploreAllClick}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-4 rounded-full font-semibold text-base tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Explore All Localities
          </button>
        </div>

        {/* Stats Section */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-md text-center p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div
              className="flex justify-center items-center mx-auto w-16 h-16 rounded-full bg-orange-100 group-hover:bg-orange-500 transition-colors duration-300 mb-4"
              data-aos="zoom-in"
              data-aos-delay="600"
            >
              <Home className="text-orange-500 w-7 h-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">150+</h3>
            <p className="text-gray-600 text-sm mt-2 font-medium">Properties Listed</p>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full group-hover:w-16 transition-all duration-300"></div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-md text-center p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div
              className="flex justify-center items-center mx-auto w-16 h-16 rounded-full bg-orange-100 group-hover:bg-orange-500 transition-colors duration-300 mb-4"
              data-aos="zoom-in"
              data-aos-delay="700"
            >
              <Users className="text-orange-500 w-7 h-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">100+</h3>
            <p className="text-gray-600 text-sm mt-2 font-medium">Happy Clients</p>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full group-hover:w-16 transition-all duration-300"></div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-md text-center p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div
              className="flex justify-center items-center mx-auto w-16 h-16 rounded-full bg-orange-100 group-hover:bg-orange-500 transition-colors duration-300 mb-4"
              data-aos="zoom-in"
              data-aos-delay="800"
            >
              <Handshake className="text-orange-500 w-7 h-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">100+</h3>
            <p className="text-gray-600 text-sm mt-2 font-medium">Successful Deals</p>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full group-hover:w-16 transition-all duration-300"></div>
          </div>
        </div>

    
      </div>
    </section>
  );
};

export default LocationsSection;