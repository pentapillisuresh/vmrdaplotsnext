'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Bed, Bath, Maximize, ChevronLeft, Heart, ChevronRight, Compass, LandPlot, Monitor,
  DoorClosed,
  Presentation,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";
import ApiService from "../hooks/ApiService";
import getPhotoSrc from "../hooks/getPhotos";

const FeaturedPropertiesContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const swiperRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Initialize only on client side
  useEffect(() => {
    setMounted(true);
    
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
    });

    // Load favorites from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  }, []);

  const isFavorite = (id) => favorites.some(item => item.id === id);

  const toggleFavorite = (listing) => {
    let updatedFavs = [...favorites];
    const exists = updatedFavs.find(item => item.id === listing.id);

    if (exists) {
      updatedFavs = updatedFavs.filter(item => item.id !== listing.id);
    } else {
      updatedFavs.push(listing);
    }

    setFavorites(updatedFavs);
    if (typeof window !== 'undefined') {
      localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} Lac`;
  };

  const getPropertiesData = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get(`/dashboard`);
      const propertyData = response.data;
      setProperties(propertyData?.mostViewedProperties?.properties || []);
    } catch (err) {
      console.error("Properties error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPropertiesData();
  }, []);

  const createSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handlePropertyClick = (property) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedProperty', JSON.stringify(property));
    }
    const slug = property.slug;
    router.push(`/property/${slug}`);
  };

  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 30,
    slidesPerView: 1,
    navigation: false,
    pagination: {
      clickable: true,
      dynamicBullets: true
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
    },
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <section className="py-20" style={{ backgroundColor: '#2C3E50' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-20" style={{ backgroundColor: '#2C3E50' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-64 bg-gray-600 rounded w-full"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative" style={{ backgroundColor: '#2C3E50' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-aos="fade-up"
          className="text-center mb-4"
        >
          <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm">
            Featured
          </span>
        </div>

        <h2
          className="text-4xl md:text-4xl font-serif font-extrabold text-center mb-2 text-white"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Featured Properties
        </h2>
        <p
          className="text-gray-300 text-center mb-12 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          VMRDA approved plots in Vizag at prime and fast-developing locations.
        </p>

        {properties.length === 0 ? (
          <div className="text-center py-10 text-gray-300 bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-blur-sm">
            No properties available.
          </div>
        ) : (
          <div className="relative group">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white border border-gray-200 hover:border-orange-500 text-gray-600 hover:text-orange-600 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:translate-x-0 opacity-0 group-hover:opacity-100 max-sm:hidden"
              aria-label="Previous properties"
            >
              <ChevronLeft size={24} className="stroke-2" />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white border border-gray-200 hover:border-orange-500 text-gray-600 hover:text-orange-600 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:translate-x-0 opacity-0 group-hover:opacity-100 max-sm:hidden"
              aria-label="Next properties"
            >
              <ChevronRight size={24} className="stroke-2" />
            </button>

            <Swiper {...swiperConfig} className="featured-properties-swiper">
              {properties.map((property) => (
                <SwiperSlide key={property.id} className="h-auto">
                  <article
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300 mx-2 my-4 border border-gray-100 hover:border-orange-200 h-full flex flex-col"
                    onClick={() => handlePropertyClick(property)}
                  >
                    <div className="relative h-56 overflow-hidden flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property);
                        }}
                        className="absolute top-3 right-3 z-10"
                        aria-label="Add to favorites"
                      >
                        <Heart
                          className={`w-7 h-7 drop-shadow-md transition ${isFavorite(property.id)
                            ? "text-red-600 fill-red-600"
                            : "text-white hover:text-red-400"
                            }`}
                        />
                      </button>

                      <img
                        src={getPhotoSrc(property.photos)}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        draggable="false"
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-[#003366] group-hover:text-orange-600 transition-colors line-clamp-2">
                          {property.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">
                          {property.address?.city}, {property.address?.locality}
                        </span>
                      </div>

                      {property?.profile && (
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 flex-wrap">
                          {property.profile.bedrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bed size={16} className="text-[#003366]" />
                              <span>{property.profile.bedrooms}</span>
                            </div>
                          )}
                          {property.profile.bathrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bath size={16} className="text-[#003366]" />
                              <span>{property.profile.bathrooms}</span>
                            </div>
                          )}
                          {property.profile.carpetArea > 0 && (
                            <div className="flex items-center gap-1">
                              <LandPlot size={16} className="text-[#003366]" />
                              <span>{property.profile.carpetArea}{property.profile.areaUnit}</span>
                            </div>
                          )}
                          {property.profile.plotArea > 0 && (
                            <div className="flex items-center gap-1">
                              <Maximize size={16} className="text-[#003366]" />
                              <span>
                                {property.profile.plotArea} {property.profile.areaUnit}
                              </span>
                            </div>
                          )}
                          {property.profile.workstations > 0 && (
                            <div className="flex items-center gap-1">
                              <Monitor size={16} className="text-[#003366]" />
                              <span>
                                {property.profile.workstations}
                              </span>
                            </div>
                          )}
                          {property.profile.cabins > 0 && (
                            <div className="flex items-center gap-1">
                              <DoorClosed size={16} className="text-[#003366]" />
                              <span>
                                {property.profile.cabins}
                              </span>
                            </div>
                          )}
                          {property.profile.conferenceRooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Presentation size={16} className="text-[#003366]" />
                              <span>
                                {property.profile.conferenceRooms}
                              </span>
                            </div>
                          )}
                          {property.profile.facing && (
                            <div className="flex items-center gap-1">
                              <Compass size={16} className="text-[#003366]" />
                              <span>
                                {property.profile.facing}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div className="text-right">
                          {property?.price ? (
                            <div className="text-2xl font-bold text-orange-600">
                              {formatPrice(property?.price)}
                            </div>
                          ) : (
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-md transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert("Contact us for price!");
                              }}
                            >
                              Contact Us
                            </button>
                          )}
                        </div>
                        <button className="text-[#003366] hover:text-orange-600 font-semibold transition-colors text-sm">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="flex justify-center mt-8 sm:hidden">
              <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-50 transition-all">
                      <ChevronLeft size={16} />
                    </div>
                    <span className="text-sm font-medium">Prev</span>
                  </button>

                  <div className="h-4 w-px bg-gray-300"></div>

                  <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group"
                  >
                    <span className="text-sm font-medium">Next</span>
                    <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-50 transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .featured-properties-swiper {
          padding: 10px 0 40px 0;
        }
        
        .featured-properties-swiper .swiper-pagination-bullet {
          background: #ffffff;
          opacity: 0.5;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        
        .featured-properties-swiper .swiper-pagination-bullet-active {
          background: #f97316;
          opacity: 1;
          width: 20px;
          border-radius: 4px;
        }
        
        .featured-properties-swiper .swiper-button-next,
        .featured-properties-swiper .swiper-button-prev {
          display: none;
        }
      `}</style>
    </section>
  );
};

const FeaturedProperties = () => {
  return (
    <Suspense fallback={
      <section className="py-20" style={{ backgroundColor: '#2C3E50' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-64 bg-gray-600 rounded w-full"></div>
          </div>
        </div>
      </section>
    }>
      <FeaturedPropertiesContent />
    </Suspense>
  );
};

export default FeaturedProperties;