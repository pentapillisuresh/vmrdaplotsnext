'use client';

import React from "react";
import { useRouter } from "next/navigation"; 
import { motion } from "framer-motion";

const PropertyCategories = ({ categories }) => {
  const router = useRouter();

  const residentialCategories = categories.filter(
    (cat) => cat.catType === "Residential"
  );

  const commercialCategories = categories.filter(
    (cat) => cat.catType === "Commercial"
  );

  // Handle category click navigation
  const handleCategoryClick = (categoryId) => {
    // Build query string with categoryId
    const queryString = new URLSearchParams({ categoryId }).toString();
    // Navigate to properties-list with the query parameter
    router.push(`/properties-list?${queryString}`);
  };
  const handleCommercialClick = () => {
    router.push("/properties-list");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-12 bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements - Solid colors */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section - Reduced padding */}
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

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-serif font-bold text-center mb-3 text-gray-900 uppercase"
        >
          Property Categories
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 text-center mb-12 max-w-3xl mx-auto text-base leading-relaxed"
        >
          vmrdaplots.com is a trusted real estate platform offering premium properties in Vizag's most sought-after locations
        </motion.p>

        {/* Residential Section - Reduced bottom margin */}
        <div className="mb-12">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {residentialCategories
              .slice()
              .sort((a, b) => {
                // Custom sorting order based on category name
                const customOrder = [
                  "Plot",
                  "Flat/Apartment",
                  "IndependentHouse/Villa",
                  "Land",
                  "FarmHouse"
                ];

                const indexA = customOrder.indexOf(a.name);
                const indexB = customOrder.indexOf(b.name);

                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
              })
              .map((cat, idx) => (
                <motion.article
                  key={cat.id}
                  variants={itemVariants}
                  className="group cursor-pointer flex flex-col h-full"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl flex flex-col h-full border border-gray-200 hover:border-orange-300 relative">
                    {/* Premium Corner Accent - Solid color */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
                    </div>
                    
                    {/* Image Container - Reduced height */}
                    <div className="relative w-full h-40 flex items-center justify-center bg-gray-100 overflow-hidden">
                      <div className="absolute inset-0 bg-black/5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <img
                        src={cat.photo}
                        alt={cat.name}
                        className="max-w-full max-h-full object-contain transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        loading="lazy"
                      />

                      {/* Hover Overlay - Solid color */}
                      <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-all duration-500 z-20"></div>
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-700"></div>
                    </div>

                    {/* Content - Reduced padding */}
                    <div className="px-4 py-4 text-center flex flex-col flex-grow justify-center border-t border-gray-100">
                      <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 tracking-wide">
                        {cat.name}
                      </h3>
                      <div className="mt-1.5 h-0.5 w-6 mx-auto bg-orange-400/0 group-hover:bg-orange-400 transition-all duration-300"></div>
                    </div>
                  </div>
                </motion.article>
              ))}

            {/* Additional Commercial Card */}
            <motion.article
              variants={itemVariants}
              className="group cursor-pointer flex flex-col h-full"
              onClick={handleCommercialClick}
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl flex flex-col h-full border border-gray-200 hover:border-orange-300 relative">
                {/* Premium Corner Accent - Solid color */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
                </div>
                
                {/* Image Container - Reduced height */}
                <div className="relative w-full h-40 flex items-center justify-center bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <img
                    src="https://backendservice.vmrdaplots.in/uploads/category/commercial.png"
                    alt="Commercial"
                    className="max-w-full max-h-full object-contain transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-all duration-500 z-20"></div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-700"></div>
                </div>

                <div className="px-4 py-4 text-center flex flex-col flex-grow justify-center border-t border-gray-100">
                  <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 tracking-wide">
                    Commercial
                  </h3>
                  <div className="mt-1.5 h-0.5 w-6 mx-auto bg-orange-400/0 group-hover:bg-orange-400 transition-all duration-300"></div>
                </div>
              </div>
            </motion.article>
          </motion.div>
        </div>

        {/* Footer Section - Minimal */}
        <div className="text-center mt-8">
          {/* Footer content - commented out */}
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;