"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

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

    if (isNaN(num)) return "N/A";

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
        response
          ?.map((item) => item?.property)
          ?.filter(Boolean) || [];

      setProperties(propertyList);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (property) => {
    const slug = property?.slug;

    if (!slug) {
      console.error("Property slug is missing:", property);
      return;
    }

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

        {/* SECTION TITLE */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-semibold text-xs uppercase tracking-[0.15em] shadow-lg">
              RECENTLY VIEWED
            </span>
          </motion.div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-10">
            Loading properties...
          </div>

        ) : properties.length === 0 ? (

          /* EMPTY STATE */
          <div className="text-center py-10 text-gray-500">
            No recently viewed properties.
          </div>

        ) : (

          /* PROPERTY SLIDER */
          <div className="relative group">

            <Swiper
              {...swiperConfig}
              className="recent-properties-swiper"
            >

              {properties.map((property, index) => {

                /*
                 * IMPORTANT:
                 * Do not use only property.id here.
                 *
                 * The API can return duplicate property IDs.
                 * Adding index guarantees that React receives
                 * a unique key for every rendered slide.
                 */
                const propertyKey =
                  `${property?.id || property?.slug || "property"}-${index}`;

                return (
                  <SwiperSlide key={propertyKey}>

                    <article
                      onClick={() =>
                        handlePropertyClick(property)
                      }
                      className="
                        bg-white
                        rounded-xl
                        shadow-lg
                        overflow-hidden
                        cursor-pointer
                        border
                        border-gray-100
                        hover:border-orange-200
                        transition-all
                        duration-300
                        hover:shadow-xl
                      "
                    >

                      {/* IMAGE */}
                      <div className="h-56 overflow-hidden relative">

                        <img
                          src={getPhotoSrc(property?.photos)}
                          alt={
                            property?.title ||
                            "Property"
                          }
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            hover:scale-105
                          "
                        />

                      </div>

                      {/* CONTENT */}
                      <div className="p-6">

                        {/* TITLE */}
                        <h3 className="text-xl font-bold text-[#003366] mb-2 line-clamp-2">
                          {property?.title || "Property"}
                        </h3>

                        {/* LOCATION */}
                        {property?.address && (
                          <div className="flex items-center gap-2 text-gray-600 mb-4">

                            <MapPin
                              size={16}
                              className="text-orange-500 flex-shrink-0"
                            />

                            <span className="text-sm line-clamp-1">
                              {property?.address?.locality}
                              {property?.address?.locality &&
                              property?.address?.city
                                ? ", "
                                : ""}
                              {property?.address?.city}
                            </span>

                          </div>
                        )}

                        {/* BOTTOM CONTENT */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">

                          {/* PRICE */}
                          <div className="text-right">

                            {property?.price ? (

                              <div className="text-2xl font-bold text-orange-600">
                                {formatPrice(
                                  property.price
                                )}
                              </div>

                            ) : (

                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  router.push("/contact");
                                }}
                                className="
                                  bg-blue-600
                                  text-white
                                  px-4
                                  py-2
                                  rounded-lg
                                  hover:bg-blue-700
                                  transition
                                "
                              >
                                Contact Us
                              </button>

                            )}

                          </div>

                          {/* VIEW DETAILS */}
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePropertyClick(property);
                            }}
                            className="
                              text-[#003366]
                              font-semibold
                              text-sm
                              hover:text-orange-500
                              transition
                            "
                          >
                            View Details →
                          </button>

                        </div>

                      </div>

                    </article>

                  </SwiperSlide>
                );
              })}

            </Swiper>

          </div>
        )}

      </div>
    </section>
  );
};

export default RecentViewProperties;