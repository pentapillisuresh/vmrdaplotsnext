'use client';

import React, { useEffect, useState, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Home,
  Users,
  Handshake,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  Award
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    params.set("city", city);
    params.set("locality", locality);
    router.push(`/properties-list?${params.toString()}`);
  };

  const handleExploreAllClick = () => {
    router.push("/properties-list");
  };

  const toggleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className="text-center mb-8 sm:mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="text-center mb-6 sm:mb-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="inline-block bg-orange-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-xs uppercase tracking-[0.15em] shadow-lg">
                  LOCATIONS
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Locations Grid - 3 columns */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {visibleLocations &&
            visibleLocations.map((location, idx) => {
              const areas = location.localities || [];
              const displayAreas = expandedCards[location.city]
                ? areas
                : areas.slice(0, 4);

              const hasMoreAreas = areas.length > 4;

              return (
                <div
                  key={location.city || idx}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border border-gray-100 hover:border-orange-300 transform hover:-translate-y-1 group"
                  data-aos="fade-up"
                  data-aos-delay={idx * 50 + 100}
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 group-hover:bg-orange-500 transition-colors duration-300 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 group-hover:text-white transition-colors duration-300" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors duration-300 truncate">
                      {location.city}
                    </h3>

                    <span className="ml-auto text-xs font-semibold text-gray-500 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                      {areas.length} Areas
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* City label before plots */}
                    <div className="text-xs sm:text-sm text-gray-500 font-medium mb-2 sm:mb-3 flex flex-wrap items-center gap-1 sm:gap-2 bg-orange-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-orange-100">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />

                      <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                        PLOTS IN {location.city.toUpperCase()}
                      </span>

                      <span className="ml-auto text-xs font-semibold text-orange-500 bg-orange-100 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
                        {areas.length}
                      </span>
                    </div>

                    {/* Areas in a row with reduced font size */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 text-gray-700 leading-relaxed">
                      {displayAreas.map((area, index) => (
                        <span
                          key={index}
                          className="hover:text-orange-500 cursor-pointer transition-all duration-300 text-[10px] sm:text-xs font-medium text-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full hover:bg-orange-50 hover:shadow-sm border border-gray-200 hover:border-orange-300"
                          onClick={() =>
                            handleAreaClick(location.city, area)
                          }
                        >
                          PLOTS IN {area.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    {/* View More/Less Areas Button per City */}
                    {hasMoreAreas && (
                      <div className="mt-2 sm:mt-3">
                        <button
                          onClick={() => toggleAreas(location.city)}
                          className="text-orange-500 font-medium text-xs sm:text-sm hover:text-orange-600 transition-all duration-300 flex items-center gap-1 hover:scale-105"
                        >
                          {expandedCards[location.city] ? (
                            <>
                              <span>View Less</span>
                              <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            </>
                          ) : (
                            <>
                              <span>
                                View More ({areas.length - 4} more)
                              </span>
                              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
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
            className="text-center mt-8 sm:mt-12"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <button
              onClick={toggleViewAll}
              className="group inline-flex items-center space-x-2 sm:space-x-3 bg-white text-orange-500 px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="text-xs sm:text-sm">
                {showAll
                  ? "View Less Locations"
                  : `View More Locations (${cityLocalities.length - 10} more)`}
              </span>

              {showAll ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
              )}
            </button>

            <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 font-medium">
              {showAll
                ? `Showing all ${cityLocalities.length} locations`
                : `Showing ${Math.min(
                    10,
                    cityLocalities.length
                  )} of ${cityLocalities.length} locations`}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div
          className="text-center mt-8 sm:mt-12"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          <button
            onClick={handleExploreAllClick}
            aria-label="Explore all localities"
            title="Click to explore all localities"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer"
          >
            <span>Explore All Localities</span>

            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-[-90deg] transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-2 font-medium">
            Click here to explore all localities
          </p>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;