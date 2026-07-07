'use client';

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ApiService from "../hooks/ApiService";

const CommercialAdSection = () => {
  const [commercialAds, setCommercialAds] = useState("");
  const [loading, setLoading] = useState(true);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });
  }, []);

  // Fetch commercial ad data once on mount
  useEffect(() => {
    const getCommercialData = async () => {
      try {
        const res = await ApiService.get(`/commercialAds/getActiveCommercialAds`, {
          headers: { "Content-Type": "application/json" },
        });

        // Assuming your API returns something like { photo: "https://..." }
        const data = res?.data || res; 
        console.log("Fetched data:", data);

        // Check if there's a photo property
        if (data?.photo) {
          setCommercialAds(data.photo);
          console.log("rrr:::",commercialAds);
        } else {
          console.warn("No commercial ad photo found, using fallback video.");
        }
      } catch (err) {
        console.error("Error fetching commercial data:", err);
      } finally {
        setLoading(false);
      }
    };

    getCommercialData();
  }, []);
  

  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
      key={commercialAds || "fallback"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src={!loading && commercialAds ? commercialAds : "/videos/real.mp4"}
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0"></div>

      {/* Content */}
      <div
        className="relative z-10 text-center text-white px-4"
        data-aos="fade-up"
      >
        {/* <h1
          className="text-4xl md:text-6xl font-extrabold tracking-widest mb-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          COMMERCIAL AD
        </h1>
        <p
          className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Explore exclusive real estate opportunities with us
        </p> */}

        {/* <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          data-aos="zoom-in"
          data-aos-delay="500"
        >
          Get Started
        </button> */}
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
    </section>
  );
};

export default CommercialAdSection;
