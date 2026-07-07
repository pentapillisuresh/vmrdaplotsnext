'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Monitor,
  DoorClosed,
  Presentation,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ApiService from "../hooks/ApiService";
import getPhotoSrc from "../hooks/getPhotos";

const RecentViewProperties = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);

  const swiperRef = useRef(null);

  useEffect(() => {
    getPropertiesData();
  }, []);

  const formatPrice = (price) => {
    if (!price) return "N/A";

    const num = parseFloat(price);

    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }

    return `₹${(num / 100000).toFixed(2)} Lac`;
  };

  const getPropertiesData = async () => {
    setLoading(true);

    const clientToken = localStorage.getItem("token");

    try {
      const response = await ApiService.get(`/propertyView/user`, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "application/json",
        },
      });

      const propertyList =
        response?.map((item) => item.property) || [];

      setProperties(propertyList);

    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE SEO URL
  const createSlug = (title) => {
    return title
      ?.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  // NAVIGATE PROPERTY PAGE
  const handlePropertyClick = (property) => {

    const slug = property.slug;

    console.log("Navigating To:", `/property/${slug}`);

    // SAVE PROPERTY IN SESSION
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "selectedProperty",
        JSON.stringify(property)
      );
    }

    // NEXTJS NAVIGATION
    router.push(`/property/${slug}`);
  };

  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 30,
    slidesPerView: 1,

    navigation: false,

    pagination: {
      clickable: true,
      dynamicBullets: true,
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

  return (
    <section className="py-20 bg-white relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-4">
          <span className="inline-block bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-medium text-sm uppercase tracking-wide">
            Recently Viewed
          </span>
        </div>

        <h2 className="text-4xl md:text-4xl font-serif font-extrabold text-center mb-12 text-gray-900">
          Recently Viewed Properties
        </h2>

        {loading ? (
          <div className="text-center py-10">
            Loading properties...
          </div>

        ) : properties.length === 0 ? (

          <div className="text-center py-10 text-gray-500">
            No recently viewed properties.
          </div>

        ) : (

          <div className="relative group">

            <Swiper
              {...swiperConfig}
              className="recent-properties-swiper"
            >

              {properties.map((property) => (

                <SwiperSlide key={property.id}>

                  <article
                    onClick={() => handlePropertyClick(property)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-orange-200"
                  >

                    {/* IMAGE */}
                    <div className="h-56 overflow-hidden relative">

                      <img
                        src={getPhotoSrc(property.photos)}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />

                    </div>

                    {/* CONTENT */}
                    <div className="p-6">

                      <h3 className="text-xl font-bold text-[#003366] mb-2">
                        {property.title}
                      </h3>

                      {property?.address && (
                        <div className="flex items-center gap-2 text-gray-600 mb-4">

                          <MapPin
                            size={16}
                            className="text-orange-500"
                          />

                          <span className="text-sm">
                            {property.address.locality},{" "}
                            {property.address.city}
                          </span>

                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">

                        <div className="text-right">

                          {property.price ? (

                            <div className="text-2xl font-bold text-orange-600">
                              {formatPrice(property.price)}
                            </div>

                          ) : (

                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                              Contact Us
                            </button>

                          )}

                        </div>

                        <button className="text-[#003366] font-semibold text-sm">
                          View Details →
                        </button>

                      </div>

                    </div>

                  </article>

                </SwiperSlide>

              ))}

            </Swiper>

          </div>

        )}

      </div>

    </section>
  );
};

export default RecentViewProperties;