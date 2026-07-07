'use client';

import React from "react";
import { useRouter } from "next/navigation"; 

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

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wider shadow-lg">
            Services
          </span>
        </div>

        <h2
          className="text-4xl md:text-4xl font-serif font-bold text-center mb-4 text-gray-900"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Property Categories
        </h2>
        <p
          className="text-gray-600 text-center mb-16 max-w-2xl mx-auto text-lg leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          vmrdaplots.com is a trusted real estate platform offering
        </p>

        {/* Residential Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                <article
                  key={cat.id}
                  data-aos="zoom-in"
                  data-aos-delay={100 + idx * 100}
                  className="group cursor-pointer flex flex-col h-full"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl flex flex-col h-full border border-gray-200 hover:border-orange-200">
                    {/* Image Container */}
                    <div className="relative w-full h-48 flex items-center justify-center bg-gray-50">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <img
                        src={cat.photo}
                        alt={cat.name}
                        className="max-w-full max-h-full object-contain transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 z-20"></div>
                    </div>

                    {/* Content */}
                    <div className="px-5 py-4 text-center flex flex-col flex-grow justify-center">
                      <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                </article>
              ))}

            {/* Additional Commercial Card */}
            <article
              data-aos="zoom-in"
              data-aos-delay={100 + residentialCategories.length * 100}
              className="group cursor-pointer flex flex-col h-full"
              onClick={handleCommercialClick}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl flex flex-col h-full border border-gray-200 hover:border-orange-200">
                {/* Image Container */}
                <div className="relative w-full h-48 flex items-center justify-center bg-gray-50">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <img
                    src="https://backendservice.vmrdaplots.in/uploads/category/commercial.png"
                    alt="Commercial"
                    className="max-w-full max-h-full object-contain transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 z-20"></div>
                </div>

                <div className="px-5 py-4 text-center flex flex-col flex-grow justify-center">
                  <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                    Commercial
                  </h3>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Footer Section */}
        <div
          className="text-center mt-16"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {/* Footer content - commented out */}
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;