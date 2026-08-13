'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    image: "/images/banner1.png",
    title: "OWN A PREMIUM PLOT NEAR VIZAG'S ICONIC COASTLINE",
    subtitle: "Invest in DTCP & VMRDA approved plots close to RK Beach, Kailasagiri, and the rapidly developing Visakhapatnam corridor. Secure your future in one of Andhra Pradesh's most sought-after locations.",
  },
  {
    id: 2,
    image: "/images/banner2.png",
    title: "INVEST NEAR BHOGAPURAM INTERNATIONAL AIRPORT",
    subtitle: "Be part of Vizag's next growth destination. Premium VMRDA-approved plots near the upcoming international airport with excellent connectivity and high appreciation potential.",
  },
  {
    id: 3,
    image: "/images/banner3.png",
    title: "OWN LAND IN VIZAG'S EMERGING TECHNOLOGY CORRIDOR",
    subtitle: "Position your investment near Vizag's fast-growing IT and infrastructure hub. Benefit from future-ready developments, expanding employment opportunities, and long-term land value growth.",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState([]);
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false);
  const router = useRouter();

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Preload next image and handle current image load state
  useEffect(() => {
    setCurrentImageLoaded(imagesLoaded.includes(current));

    const nextIndex = (current + 1) % slides.length;
    if (!imagesLoaded.includes(nextIndex)) {
      const img = new Image();
      img.src = slides[nextIndex].image;
      img.onload = () => {
        setImagesLoaded(prev => [...prev, nextIndex]);
      };
    }
  }, [current, imagesLoaded]);

  // Preload first image on component mount
  useEffect(() => {
    const img = new Image();
    img.src = slides[0].image;
    img.onload = () => {
      setImagesLoaded(prev => [...prev, 0]);
      setCurrentImageLoaded(true);
    };
  }, []);

  const handleSlideChange = (index) => {
    setCurrent(index);
    if (!imagesLoaded.includes(index)) {
      const img = new Image();
      img.src = slides[index].image;
      img.onload = () => {
        setImagesLoaded(prev => [...prev, index]);
      };
    }
  };

  return (
    <div className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 1.5,
              ease: "easeOut"
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 1.1,
            transition: {
              duration: 1.2,
              ease: "easeIn"
            }
          }}
        >
          {/* Loading placeholder */}
          {!currentImageLoaded && (
            <motion.div 
              className="absolute inset-0 bg-black z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </motion.div>
          )}
          
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              currentImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => {
              setCurrentImageLoaded(true);
              if (!imagesLoaded.includes(current)) {
                setImagesLoaded(prev => [...prev, current]);
              }
            }}
            onError={() => {
              setCurrentImageLoaded(true);
            }}
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark Overlay - More subtle for premium look */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Text Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.9,
                ease: "easeOut",
                delay: 0.2
              }
            }}
            exit={{ 
              opacity: 0, 
              y: -30,
              transition: {
                duration: 0.6,
                ease: "easeIn"
              }
            }}
            className="max-w-5xl px-2 sm:px-4"
          >
            <motion.h1 
              className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-2xl leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.4
                }
              }}
              exit={{ 
                opacity: 0, 
                y: 20,
                transition: {
                  duration: 0.5,
                  ease: "easeIn"
                }
              }}
            >
              {slides[current].title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.6
                }
              }}
              exit={{ 
                opacity: 0, 
                y: 20,
                transition: {
                  duration: 0.5,
                  ease: "easeIn"
                }
              }}
              className="max-w-3xl mx-auto px-2"
            >
              <motion.p 
                className="text-xs sm:text-sm md:text-base lg:text-lg font-light text-gray-200/90 mb-4 sm:mb-6 md:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none"
              >
                {slides[current].subtitle}
              </motion.p>
            </motion.div>
           
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.8
                }
              }}
              exit={{ 
                opacity: 0, 
                y: 20,
                transition: {
                  duration: 0.5,
                  ease: "easeIn"
                }
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 px-2"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full font-semibold shadow-2xl hover:bg-gray-50 transition-all duration-300 text-xs sm:text-sm md:text-base lg:text-lg tracking-wide w-full sm:w-auto"
                onClick={() => router.push("/properties-list")}
              >
                Explore Premium Plots
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/60 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm md:text-base lg:text-lg tracking-wide w-full sm:w-auto"
                onClick={() => router.push("/contact")}
              >
                Contact Us
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3 sm:space-x-4">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`transition-all duration-500 ${
              current === index
                ? "w-8 sm:w-10 md:w-12 h-1.5 bg-white shadow-lg"
                : "w-2 sm:w-2.5 md:w-3 h-1.5 bg-white/40 hover:bg-white/60"
            }`}
            whileHover={{ scaleY: 1.5 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Slide Counter - Premium Touch */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-30 text-white/60 text-xs sm:text-sm tracking-widest font-light hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </motion.div>
    </div>
  );
};

export default Hero;