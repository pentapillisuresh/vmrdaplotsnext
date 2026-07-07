'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    image: "/images/vmrda12.jpg",
    title: "VMRDA Approved Plots in Vizag – Best Open Plots for Sale Vizag",
    subtitle: "Trusted VMRDA Plots in Visakhapatnam at Prime Locations.",
  },
  {
    id: 2,
    image: "/images/vmrda11.jpg",
    title: "Residential Plots Near Bhogapuram Airport",
    subtitle: "Best investment opportunity near upcoming Vizag International Airport",
  },
  {
    id: 3,
    image: "/images/vmrda13.jpg",
    title: "VMRDA Approved Layouts",
    subtitle: "Clear documentation • Bank-loan friendly • Secure investment",
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
    // Reset current image loaded state when slide changes
    setCurrentImageLoaded(imagesLoaded.includes(current));

    // Preload next image
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

  // Handle manual slide change
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

  // Optimize image loading with quality parameters (if using CDN)
  const getOptimizedImageUrl = (imagePath) => {
    // If you're using a CDN, you can add quality parameters here
    // Example: return `${imagePath}?q=80&w=1920`; // 80% quality, 1920px width
    return imagePath;
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, x: 100 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            transition: {
              duration: 1.2,
              ease: "easeInOut"
            }
          }}
          exit={{ 
            opacity: 0, 
            x: -100,
            transition: {
              duration: 1.2,
              ease: "easeInOut"
            }
          }}
        >
          {/* Loading placeholder */}
          {!currentImageLoaded && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-gray-600 text-lg">Loading...</div>
            </motion.div>
          )}
          
          <img
            src={getOptimizedImageUrl(slides[current].image)}
            alt={slides[current].title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              currentImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => {
              setCurrentImageLoaded(true);
              if (!imagesLoaded.includes(current)) {
                setImagesLoaded(prev => [...prev, current]);
              }
            }}
            onError={() => {
              // Fallback in case image fails to load
              setCurrentImageLoaded(true);
            }}
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />

      {/* Text Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.3
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
            className="text-white px-4"
          >
            <motion.h1 
              className="text-4xl md:text-4xl font-serif font-bold mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: -30 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.5
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                transition: {
                  duration: 0.5,
                  ease: "easeIn"
                }
              }}
            >
              {slides[current].title}
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl font-light text-gray-200 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.7
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -15,
                transition: {
                  duration: 0.5,
                  ease: "easeIn"
                }
              }}
            >
              {slides[current].subtitle}
            </motion.p>
           
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.9
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -10,
                transition: {
                  duration: 0.5,
                  ease: "easeIn"
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition"
              onClick={() => router.push("/properties-list")}
            >
              Explore Now
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              current === index
                ? "bg-white scale-125 shadow-md"
                : "bg-white/40 hover:bg-white/60"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;