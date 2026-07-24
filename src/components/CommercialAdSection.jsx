'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import ApiService from "../hooks/ApiService";
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';

const CommercialAdSection = () => {
  const [commercialAds, setCommercialAds] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState(null);

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

        const data = res?.data || res; 
        console.log("Fetched data:", data);

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

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video with Premium Overlay */}
      <div className="absolute inset-0">
        <video
          ref={(el) => setVideoRef(el)}
          key={commercialAds || "fallback"}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src={!loading && commercialAds ? commercialAds : "/videos/real.mp4"}
            type="video/mp4"
          />
        </video>
        
        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          data-aos="fade-up"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4 px-5 py-1.5 border border-white/20 rounded-full backdrop-blur-sm bg-white/5"
          >
            <span className="text-white/70 text-xs font-light tracking-[0.2em] uppercase">
              Exclusive Feature
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 tracking-tight text-white"
          >
            Premium Commercial
            <br />
            <span className="text-white/90">Spaces in Vizag</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm md:text-base text-gray-300/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Discover premium commercial properties in Vizag's most sought-after locations. 
            Perfect for your business growth and investment goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold shadow-xl hover:bg-gray-100 transition-all duration-300 text-sm tracking-wide"
            >
              Explore Commercial Properties
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white/30 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-sm tracking-wide"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Controls - Premium Style */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="text-white/70 hover:text-white transition-colors p-1.5"
        >
          {isPlaying ? <FiPause size={14} /> : <FiPlay size={14} />}
        </motion.button>
        
        <div className="w-px h-4 bg-white/20"></div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="text-white/70 hover:text-white transition-colors p-1.5"
        >
          {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
        </motion.button>
        
        <div className="w-px h-4 bg-white/20"></div>
        
        <div className="text-white/50 text-[10px] tracking-[0.2em] font-light px-2">
          FEATURED
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-light">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"></div>
      </motion.div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
    </section>
  );
};

export default CommercialAdSection;