
'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PropertyCategories = ({ categories }) => {
  const [mounted, setMounted] = useState(false);
  const [residentialCategories, setResidentialCategories] = useState([]);
  const [commercialCategories, setCommercialCategories] = useState([]);

  useEffect(() => {
    setMounted(true);

    if (categories && categories.length > 0) {
      const residential = categories.filter(
        (cat) => cat.catType === "Residential"
      );

      const commercial = categories.filter(
        (cat) => cat.catType === "Commercial"
      );

      // Sort residential categories
      const customOrder = [
        "Plot",
        "Flat/Apartment",
        "IndependentHouse/Villa",
        "Land",
        "FarmHouse",
      ];

      const sortedResidential = [...residential].sort((a, b) => {
        const indexA = customOrder.indexOf(a.name);
        const indexB = customOrder.indexOf(b.name);

        return (
          (indexA === -1 ? 999 : indexA) -
          (indexB === -1 ? 999 : indexB)
        );
      });

      setResidentialCategories(sortedResidential);
      setCommercialCategories(commercial);
    } else {
      setResidentialCategories([]);
      setCommercialCategories([]);
    }
  }, [categories]);

  // Open a residential category in a new tab
  const handleCategoryClick = (categoryId) => {
    if (!categoryId) {
      console.error("Category ID is missing");
      return;
    }

    const params = new URLSearchParams();
    params.set("categoryId", String(categoryId));

    const url = `/properties-list?${params.toString()}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Open all properties in a new tab
  const handleCommercialClick = () => {
    const params = new URLSearchParams();
    params.set("catType","Commercial");

    const url = `/properties-list?${params.toString()}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Keyboard accessibility
  const handleKeyDown = (event, callback) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Loading UI
  if (!mounted) {
    return (
      <section className="py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-semibold text-xs uppercase tracking-[0.15em] shadow-lg">
              Loading...
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-md h-64 animate-pulse"
              >
                <div className="h-40 bg-gray-200 rounded-t-xl"></div>
                <div className="h-24 bg-gray-100 rounded-b-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show only if categories exist
  if (
    residentialCategories.length === 0 &&
    commercialCategories.length === 0
  ) {
    return null;
  }

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-semibold text-xs uppercase tracking-[0.15em] shadow-lg">
              Services
            </span>
          </motion.div>
        </div>

        {/* Residential and Commercial Categories */}
        <div className="mb-12">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Residential Cards */}
            {residentialCategories.map((cat, idx) => (
              <motion.article
                key={cat.id || idx}
                variants={itemVariants}
                className="group cursor-pointer flex flex-col h-full"
                onClick={() => handleCategoryClick(cat.id)}
                onKeyDown={(event) =>
                  handleKeyDown(event, () =>
                    handleCategoryClick(cat.id)
                  )
                }
                role="link"
                tabIndex={0}
                aria-label={`View properties in ${cat.name}`}
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl flex flex-col h-full border border-gray-200 hover:border-orange-300 relative">
                  {/* Premium Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
                  </div>

                  {/* Image Container */}
                  <div className="relative w-full h-40 flex items-center justify-center bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-black/5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <img
                      src={cat.photo || "/images/logo.jpg"}
                      alt={cat.name}
                      className="max-w-full max-h-full object-contain transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/logo.jpg";
                      }}
                    />

                    <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-all duration-500 z-20"></div>

                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-700"></div>
                  </div>

                  {/* Content */}
                  <div className="px-4 py-4 text-center flex flex-col flex-grow justify-center border-t border-gray-100">
                    <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 tracking-wide">
                      {cat.name}
                    </h3>

                    <div className="mt-1.5 h-0.5 w-6 mx-auto bg-orange-400/0 group-hover:bg-orange-400 transition-all duration-300"></div>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* Commercial Card */}
            {commercialCategories.length > 0 && (
              <motion.article
                key="commercial"
                variants={itemVariants}
                className="group cursor-pointer flex flex-col h-full"
                onClick={handleCommercialClick}
                onKeyDown={(event) =>
                  handleKeyDown(event, handleCommercialClick)
                }
                role="link"
                tabIndex={0}
                aria-label="View commercial properties"
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl flex flex-col h-full border border-gray-200 hover:border-orange-300 relative">
                  {/* Premium Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
                  </div>

                  {/* Image Container */}
                  <div className="relative w-full h-40 flex items-center justify-center bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-black/5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <img
                      src="/images/commercial.png"
                      alt="Commercial"
                      className="max-w-full max-h-full object-contain transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/logo.jpg";
                      }}
                    />

                    <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-all duration-500 z-20"></div>

                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-700"></div>
                  </div>

                  {/* Content */}
                  <div className="px-4 py-4 text-center flex flex-col flex-grow justify-center border-t border-gray-100">
                    <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 tracking-wide">
                      Commercial
                    </h3>

                    <div className="mt-1.5 h-0.5 w-6 mx-auto bg-orange-400/0 group-hover:bg-orange-400 transition-all duration-300"></div>
                  </div>
                </div>
              </motion.article>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;
