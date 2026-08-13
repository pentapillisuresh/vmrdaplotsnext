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
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Video - No overlays */}
      <div className="absolute inset-0">
        <video
          ref={(el) => setVideoRef(el)}
          key={commercialAds || "fallback"}
          autoPlay
          loop
        muted={true}
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src={!loading && commercialAds ? commercialAds : "/videos/real.mp4"}
            type="video/mp4"
          />
        </video>
      </div>

      {/* Video Controls - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="text-white hover:text-white/80 transition-colors p-1.5"
        >
          {isPlaying ? <FiPause size={14} /> : <FiPlay size={14} />}
        </motion.button>
        
        <div className="w-px h-4 bg-white/30"></div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="text-white hover:text-white/80 transition-colors p-1.5"
        >
          {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
        </motion.button>
        
        <div className="w-px h-4 bg-white/30"></div>
        
        <div className="text-white/60 text-[10px] tracking-[0.2em] font-light px-2">
          FEATURED
        </div>
      </div>

      {/* Simple Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-light">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default CommercialAdSection;