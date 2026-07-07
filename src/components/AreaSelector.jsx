'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import areaData from '../data/areaData';

const AreaSelector = () => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with animation */}
        <div className="text-center mb-12 overflow-hidden">
          <div className="inline-flex items-center justify-center mb-4 opacity-0 animate-fadeInDown">
            <div className="w-12 h-1 bg-[#001F3F] rounded-full"></div>
            <span className="mx-4 text-[#001F3F] font-semibold text-sm uppercase tracking-wider">Explore Areas</span>
            <div className="w-12 h-1 bg-[#001F3F] rounded-full"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#001F3F] mb-6 opacity-0 animate-fadeInDown animation-delay-100">
            Discover Vizag's Prime Locations
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed opacity-0 animate-fadeInDown animation-delay-200">
            Select an area to explore available plots, current market prices, and investment potential
          </p>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="mb-8 px-2 opacity-0 animate-fadeIn animation-delay-300">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-[#001F3F] transition-colors duration-200">Home</Link>
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/areas" className="hover:text-[#001F3F] transition-colors duration-200">Areas</Link>
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#001F3F] font-medium">Vizag Areas</span>
          </nav>
        </div>

        {/* Areas Grid - 5 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {areaData.map((area, index) => (
            <div
              key={area.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="opacity-0 transform translate-y-4"
            >
              <Link
                href={`/area/${area.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden h-full border border-gray-200 hover:border-[#001F3F]/20 hover:scale-[1.02]">
                  {/* Area Header with shimmer effect */}
                  <div className="p-4 pb-3 border-b border-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <h3 className="font-bold text-base text-[#001F3F] group-hover:text-[#001F3F]/90 transition-colors duration-300 line-clamp-1">
                        {area.name}
                      </h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full transition-all duration-300 transform group-hover:scale-105 ${
                        area.demand === 'Very High' ? 'bg-red-50 text-red-700 border border-red-200' :
                        area.demand === 'High' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        area.demand === 'Medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {area.demand}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 relative z-10 mt-1">
                      <svg className="w-4 h-4 mr-1 text-gray-400 group-hover:text-[#001F3F] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-xs font-medium text-gray-600 truncate">{area.location}</p>
                    </div>
                  </div>

                  {/* Area Details */}
                  <div className="p-4 pt-3">
                    {/* View Details Button */}
                    <div className="relative overflow-hidden rounded-lg group-hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-[#001F3F]/5 to-[#001F3F]/10 group-hover:from-[#001F3F]/10 group-hover:to-[#001F3F]/15 transition-all duration-500">
                        <span className="text-[#001F3F] font-semibold text-xs">View Details</span>
                        <svg className="w-4 h-4 text-[#001F3F] transform group-hover:translate-x-1 transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#001F3F]/0 via-[#001F3F]/5 to-[#001F3F]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      `}</style>
    </div>
  );
};

export default AreaSelector;