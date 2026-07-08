'use client';

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Home, Compass, Share2, Bed, Bath, Maximize,
  Building, MapPin, CheckCircle, Phone, Mail, Calendar, ChevronDown, ChevronUp,
  Monitor, DoorClosed, Presentation, Heart, ChevronLeft, ChevronRight,
  Play, Video, Image as ImageIcon, X, User, MessageSquare, Send,
  ArrowUp, ArrowDown
} from "lucide-react";
import ApiService from "../hooks/ApiService";
import AOS from "aos";
import PropertyMap from "../components/PropertyMap";
import getPhotoSrc from "../hooks/getPhotos";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Social Media Icons
const SocialIcons = {
  whatsapp: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg",
  facebook: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg",
  twitter: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg",
  linkedin: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg",
  telegram: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg",
  email: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg",
  share: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/share-2.svg"
};

function PropertyDetailContent({ title: propTitle }) {
  const slug = propTitle;
  const router = useRouter();
  const swiperRef = useRef(null);
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [page, setPage] = useState(1);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [fromUser, setFromUser] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Favorites functionality
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
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

  // Helper function to convert title to slug
  const createSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Helper function to convert slug back to title
  const slugToTitle = (slug) => {
    if (!slug) return "";
    return slug
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Swiper configuration for similar properties
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
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
    },
  };

  // Share functionality
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      if (property?.title) {
        return `${window.location.origin}/property/${createSlug(property.title)}`;
      }
      return `${window.location.origin}/property/${slug}`;
    }
    return "";
  };

  const getShareMessage = () => {
    return `Check out this amazing property: ${property?.title} - ${formatPrice(property?.price)}`;
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareMessage() + '\n' + getShareUrl())}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareMessage())}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(getShareMessage())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    const subject = `Check out this property: ${property?.title}`;
    const body = `${getShareMessage()}\n\nView more details: ${getShareUrl()}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: getShareMessage(),
          url: getShareUrl(),
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const payload = {
      propertyId: property?.id || null,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      message: formData.message,
      leadType: "callback",
    };
    try {
      const response = await ApiService.post("/leads", payload, {
        headers: { "Content-Type": "application/json" }
      });
      if (response) {
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
        alert("Thank you for contacting us, our team will contact you very soon");
        setTimeout(() => setStatus(""), 2000);
      } else {
        setStatus("❌ Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setStatus("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Get fromUser from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = sessionStorage.getItem('fromUser');
      if (user) setFromUser(user);
    }
  }, []);

  // Fetch property by slug/title
  useEffect(() => {
    if (slug) {
      const storedProp = sessionStorage.getItem('selectedProperty');
      if (storedProp) {
        const parsedProp = JSON.parse(storedProp);
        setProperty(parsedProp);
        sessionStorage.removeItem('selectedProperty');
        setLoading(false);
        window.scrollTo(0, 0);
      } else {
        fetchPropertyBySlug();
      }
    }
  }, [slug]);

  const fetchPropertyBySlug = async () => {
    try {
      setLoading(true);
      const decodedTitle = slugToTitle(slug);
      
      const response = await ApiService.get(`/properties/getBySlug/${slug}`);
      
      if (response?.property) {
          setProperty(response?.property);
          window.scrollTo(0, 0);
        } else {
          console.error("Property not found with slug:", slug);
          router.push('/properties-list');
        }
    } catch (error) {
      console.error('Error fetching property by slug:', error);
      router.push('/properties-list');
    } finally {
      setLoading(false);
    }
  };

  const getpropertyByCategory = async () => {
    if (!property?.categoryId) return;
    try {
      const response = await ApiService.get(`/properties?categoryId=${property.categoryId}&limit=5`);
      if (response?.properties) {
        const filtered = response.properties.filter((item) => item.id !== property?.id);
        setSimilarProperties(filtered || []);
      }
    } catch (error) {
      console.error('Error fetching similar properties:', error);
    }
  };

  const addViewProperty = async () => {
    try {
      const clientToken = localStorage.getItem("token");
      await ApiService.post(`/propertyView`, { propertyId: property?.id }, {
        headers: { Authorization: `Bearer ${clientToken}`, 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const updateViewCount = async () => {
    try {
      const clientToken = localStorage.getItem("token");
      await ApiService.put(`/properties/updateView/${property?.id}`, {}, {
        headers: { Authorization: `Bearer ${clientToken}`, 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin === 'true' && property?.id) {
      addViewProperty();
    }
    if (property?.id) {
      setTimeout(() => updateViewCount(), 5000);
    }
  }, [property?.id]);

  useEffect(() => {
    if (property) {
      getpropertyByCategory();
    }
  }, [property]);

  // Format price
  const formatPrice = (price) => {
    if (!price) return "-";
    const num = parseFloat(price);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
    return `₹${num.toLocaleString()}`;
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getTruncatedDescription = (description, maxLength = 300) => {
    if (!description) return "";
    if (description.length <= maxLength || showFullDescription) return description;
    return description.substring(0, maxLength) + "...";
  };

  const profile = property?.profile || {};
  const address = property?.address || {};
  const category = property?.category || {};
  const client = property?.client || {};

  // Parse gallery images and videos
  let galleryImages = [];
  let videoUrls = [];
  
  try {
    if (Array.isArray(property?.photos)) {
      galleryImages = property.photos;
    } else if (typeof property?.photos === 'string' && property.photos.startsWith('[')) {
      galleryImages = JSON.parse(property.photos);
    } else if (property?.photos) {
      galleryImages = [property.photos];
    } else {
      galleryImages = [];
    }
  } catch (err) {
    console.error('Error parsing photos:', err);
    galleryImages = [];
  }

  // Parse videos - handle string URL or array
  try {
    if (property?.videos) {
      if (typeof property.videos === 'string') {
        if (property.videos.startsWith('[')) {
          videoUrls = JSON.parse(property.videos) || [];
        } else {
          videoUrls = [property.videos];
        }
      } else if (Array.isArray(property.videos)) {
        videoUrls = property.videos;
      }
    }
  } catch (e) {
    videoUrls = [];
  }

  // Combine all media: photos first, then videos
  const allMedia = [...galleryImages, ...videoUrls];
  const hasVideo = videoUrls.length > 0;
  const totalMedia = allMedia.length;

  const isVideo = (index) => {
    return index >= galleryImages.length && hasVideo;
  };

  const getMediaUrl = (index) => {
    if (index < galleryImages.length) {
      return galleryImages[index];
    } else {
      const videoIndex = index - galleryImages.length;
      return videoUrls[videoIndex];
    }
  };

  const safeShow = (val) => val !== null && val !== undefined && val !== "" && val !== 0;

  const handleBackToListings = () => {
    router.push('/properties-list');
  };

  const handleSimilarPropertyClick = (property) => {
    sessionStorage.setItem('selectedProperty', JSON.stringify(property));
    const slug = property.slug;
    router.push(`/property/${slug}`);
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsVideoPlaying(true);
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Property not found</p>
          <button
            onClick={handleBackToListings}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Bar - Premium */}
      <div className="relative bg-gradient-to-r from-[#001F3F] via-[#002D5C] to-[#003366] text-white py-6 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={handleBackToListings}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Listings</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm font-medium">{category.name || "Property Details"}</span>
            </div>
            {property?.approvedBy && (
              <div className="bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30">
                <span className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {property.approvedBy}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            {/* Image Gallery with Video Support */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100">
              <div className="relative h-[450px] bg-gray-900">
                {totalMedia > 0 ? (
                  <>
                    {isVideo(selectedImage) ? (
                      <video
                        ref={videoRef}
                        src={getMediaUrl(selectedImage)}
                        className="w-full h-full object-contain"
                        muted
                        playsInline
                        loop
                        onClick={handleVideoClick}
                        controls
                      />
                    ) : (
                      <img
                        src={getMediaUrl(selectedImage)}
                        alt={property?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <ImageIcon className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property);
                  }}
                  className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    className={`w-6 h-6 transition ${isFavorite(property?.id)
                      ? "text-red-600 fill-red-600"
                      : "text-gray-600 hover:text-red-400"
                    }`}
                  />
                </button>

                {/* Video Badge */}
                {isVideo(selectedImage) && (
                  <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg">
                    <Play className="w-3 h-3" />
                    Video
                  </div>
                )}

                {selectedImage > 0 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft size={24} className="text-[#003366]" />
                  </button>
                )}
                {selectedImage < totalMedia - 1 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight size={24} className="text-[#003366]" />
                  </button>
                )}

                {/* Media Counter */}
                {totalMedia > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    {isVideo(selectedImage) ? (
                      <Video className="w-3 h-3" />
                    ) : (
                      <ImageIcon className="w-3 h-3" />
                    )}
                    {selectedImage + 1} / {totalMedia}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {totalMedia > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {allMedia.map((item, idx) => {
                    const isVideoItem = idx >= galleryImages.length;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 relative ${
                          selectedImage === idx
                            ? "border-orange-500 ring-2 ring-orange-200 shadow-lg scale-105"
                            : "border-gray-200 hover:border-orange-300 hover:scale-105"
                        }`}
                      >
                        {isVideoItem ? (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <img 
                            src={item} 
                            alt={`View ${idx + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                            }}
                          />
                        )}
                        {isVideoItem && (
                          <div className="absolute bottom-0 left-0 right-0 bg-red-500/80 text-white text-[8px] text-center py-0.5 font-medium">
                            VIDEO
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Main Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {property?.title}
                  </h1>
                  {property?.propertyName && (
                    <h3 className="text-sm font-semibold text-orange-600 mb-2">{property?.propertyName}</h3>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} className="text-orange-500 flex-shrink-0" />
                    <span className="text-base">
                      {address?.locality && `${address?.locality}, `}
                      {address?.city && `${address?.city}`}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {property?.price ? (
                    <div className="text-3xl md:text-4xl font-bold text-orange-600">
                      {formatPrice(property?.price)}
                    </div>
                  ) : (
                    <button
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-orange-200 transition-all duration-300 transform hover:scale-105"
                      onClick={() => alert("Contact us for price!")}
                    >
                      Contact Us for Price
                    </button>
                  )}
                </div>
              </div>

              {/* Share Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-y border-gray-200 gap-3">
                <div className="flex items-center gap-2">
                  <Share2 size={18} className="text-orange-500" />
                  <span className="text-gray-700 font-medium">Share this property:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={shareOnWhatsApp} className="w-9 h-9 flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-full transition-all duration-300 hover:scale-110 shadow-md">
                    <img src={SocialIcons.whatsapp} alt="WhatsApp" className="w-4 h-4 filter invert" />
                  </button>
                  <button onClick={shareOnFacebook} className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-300 hover:scale-110 shadow-md">
                    <img src={SocialIcons.facebook} alt="Facebook" className="w-4 h-4 filter invert" />
                  </button>
                  <button onClick={shareOnTwitter} className="w-9 h-9 flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full transition-all duration-300 hover:scale-110 shadow-md">
                    <img src={SocialIcons.twitter} alt="Twitter" className="w-4 h-4 filter invert" />
                  </button>
                  <button onClick={shareOnLinkedIn} className="w-9 h-9 flex items-center justify-center bg-blue-800 hover:bg-blue-900 rounded-full transition-all duration-300 hover:scale-110 shadow-md">
                    <img src={SocialIcons.linkedin} alt="LinkedIn" className="w-4 h-4 filter invert" />
                  </button>
                  <button onClick={shareOnTelegram} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-300 hover:scale-110 shadow-md">
                    <img src={SocialIcons.telegram} alt="Telegram" className="w-4 h-4 filter invert" />
                  </button>
                  <button onClick={shareViaEmail} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full transition-all duration-300 hover:scale-110 shadow-md">
                    <img src={SocialIcons.email} alt="Email" className="w-4 h-4 filter invert" />
                  </button>
                  <button onClick={shareViaNative} className="w-9 h-9 flex items-center justify-center bg-gray-600 hover:bg-gray-700 rounded-full transition-all duration-300 hover:scale-110 shadow-md">
                    <img src={SocialIcons.share} alt="Share" className="w-4 h-4 filter invert" />
                  </button>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                {category.name === "Plot" || category.name === "Land" ? (
                  <>
                    {category.name !== "Land" ? (
                      safeShow(profile?.plotArea) && (
                        <FeatureCardPremium
                          icon={<Maximize size={22} />}
                          label="Plot Area"
                          value={`${profile?.plotArea} ${profile?.areaUnit || "sqft"}`}
                        />
                      )
                    ) : (
                      safeShow(profile?.landArea) && (
                        <FeatureCardPremium
                          icon={<Maximize size={22} />}
                          label="Land Area"
                          value={`${profile?.landArea} ${profile?.areaUnit || "sqft"}`}
                        />
                      )
                    )}
                    {safeShow(profile?.facing) && (
                      <FeatureCardPremium
                        icon={<Compass size={22} />}
                        label="Facing"
                        value={profile?.facing}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {safeShow(profile?.bedrooms) && (
                      <FeatureCardPremium icon={<Bed size={22} />} label="Bedrooms" value={profile?.bedrooms} />
                    )}
                    {safeShow(profile?.bathrooms) && (
                      <FeatureCardPremium icon={<Bath size={22} />} label="Bathrooms" value={profile?.bathrooms} />
                    )}
                    {safeShow(profile?.carpetArea) && (
                      <FeatureCardPremium
                        icon={<Maximize size={22} />}
                        label="Carpet Area"
                        value={`${profile?.carpetArea} ${profile?.areaUnit || "sqft"}`}
                      />
                    )}
                    {safeShow(profile?.workstations) && (
                      <FeatureCardPremium
                        icon={<Monitor size={22} />}
                        label="Work Station"
                        value={profile?.workstations}
                      />
                    )}
                    {safeShow(profile?.cabins) && (
                      <FeatureCardPremium
                        icon={<DoorClosed size={22} />}
                        label="Cabin"
                        value={profile?.cabins}
                      />
                    )}
                    {safeShow(profile?.conferenceRooms) && (
                      <FeatureCardPremium
                        icon={<Presentation size={22} />}
                        label="Meeting Rooms"
                        value={profile?.conferenceRooms}
                      />
                    )}
                    {safeShow(profile?.status) && (
                      <FeatureCardPremium icon={<Building size={22} />} label="Status" value={profile?.status} />
                    )}
                  </>
                )}
              </div>

              {/* Property Details */}
              <SectionPremium title="Property Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {safeShow(category.name) && (
                    <DetailCard icon={<Building size={18} />} label="Property Type" value={category.name} />
                  )}
                  {safeShow(address?.locality) && (
                    <DetailCard icon={<MapPin size={18} />} label="Locality" value={address.locality} />
                  )}
                  {safeShow(address?.city) && (
                    <DetailCard icon={<MapPin size={18} />} label="City" value={address.city} />
                  )}
                  {safeShow(profile?.totalFloors) && (
                    <DetailCard icon={<Building size={18} />} label="Total Floors" value={profile.totalFloors} />
                  )}
                  {safeShow(profile?.furnishedStatus) && (
                    <DetailCard icon={<Sparkles size={18} />} label="Furnished Status" value={profile.furnishedStatus} />
                  )}
                  {safeShow(property?.availableStatus) && (
                    <DetailCard icon={<CheckCircle size={18} />} label="Availability" value={property.availableStatus} />
                  )}
                </div>
              </SectionPremium>

              {/* Nearby Places */}
              {Array.isArray(address?.near_by) && address.near_by.length > 0 && (
                <SectionPremium title="Nearby Places">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {address.near_by.map((place, idx) => (
                      <DetailCard key={idx} icon={<MapPin size={18} />} label={place.info} value={place.distance || "Nearby"} />
                    ))}
                  </div>
                </SectionPremium>
              )}

              {/* Amenities */}
              {Array.isArray(property?.amenities) && property?.amenities.length > 0 && (
                <SectionPremium title="Amenities & Features">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {property?.amenities.map((a, idx) => (
                      <DetailCard key={idx} icon={<CheckCircle size={18} />} label={a} value="" />
                    ))}
                  </div>
                </SectionPremium>
              )}

              {/* Approved By */}
              {property?.approvedBy && (
                <SectionPremium title="Approved By">
                  <div className="flex flex-wrap gap-2">
                    {typeof property.approvedBy === 'string' 
                      ? property.approvedBy.split(',').map((item, idx) => (
                          <span key={idx} className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 shadow-sm">
                            {item.trim()}
                          </span>
                        ))
                      : Array.isArray(property.approvedBy) && property.approvedBy.map((item, idx) => (
                          <span key={idx} className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 shadow-sm">
                            {item}
                          </span>
                        ))
                    }
                  </div>
                </SectionPremium>
              )}

              {/* Overview - Fixed Read More/Show Less */}
              {safeShow(property?.description) && (
                <SectionPremium title="Overview">
                  <div className="text-gray-700 leading-relaxed">
                    <div className="space-y-3">
                      {(() => {
                        const description = property?.description || '';
                        const maxLength = 300;
                        
                        if (description.length <= maxLength) {
                          // Show full description if short
                          return description.split('\n').map((line, index) => {
                            const trimmedLine = line.trim();
                            if (!trimmedLine) return null;
                            const cleanLine = trimmedLine.replace(/^[?•\-*]\s*/, '');
                            return (
                              <div key={index} className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                </div>
                                <p className="text-base text-gray-700">{cleanLine}</p>
                              </div>
                            );
                          });
                        } else {
                          // Show truncated or full based on state
                          const displayText = showFullDescription ? description : description.substring(0, maxLength);
                          const lines = displayText.split('\n');
                          
                          // If not showing full and we're truncating mid-line
                          let displayLines = [];
                          if (!showFullDescription) {
                            // Find the last complete line within the limit
                            let charCount = 0;
                            for (let line of lines) {
                              if (charCount + line.length <= maxLength) {
                                displayLines.push(line);
                                charCount += line.length + 1; // +1 for newline
                              } else {
                                // Add partial line with ellipsis
                                const remaining = maxLength - charCount;
                                if (remaining > 0) {
                                  displayLines.push(line.substring(0, remaining) + '...');
                                }
                                break;
                              }
                            }
                          } else {
                            displayLines = lines;
                          }
                          
                          return displayLines.map((line, index) => {
                            const trimmedLine = line.trim();
                            if (!trimmedLine) return null;
                            const cleanLine = trimmedLine.replace(/^[?•\-*]\s*/, '');
                            return (
                              <div key={index} className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                </div>
                                <p className="text-base text-gray-700">{cleanLine}</p>
                              </div>
                            );
                          });
                        }
                      })()}
                    </div>
                    
                    {/* Read More / Show Less Button */}
                    {property?.description && property.description.length > 300 && (
                      <button 
                        onClick={toggleDescription} 
                        className="mt-4 inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-all duration-300 hover:gap-3 group"
                      >
                        {showFullDescription ? (
                          <>
                            <span>Show Less</span>
                            <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                          </>
                        ) : (
                          <>
                            <span>Read More</span>
                            <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </SectionPremium>
              )}

              {/* Map Section */}
              <SectionPremium title="Location on Map">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <PropertyMap lat={address?.lat} lon={address?.lon} />
                </div>
              </SectionPremium>
            </div>
          </div>

          {/* Right Section - Contact Premium */}
          {fromUser !== 'client' && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-8 overflow-hidden">
                {/* Contact Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Phone size={18} />
                    Contact Agent
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Contact Details Toggle */}
                  <button
                    onClick={() => setShowContact(!showContact)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      showContact 
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200" 
                        : "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {showContact ? (
                      <>
                        <X size={18} />
                        Hide Contact Details
                      </>
                    ) : (
                      <>
                        <Phone size={18} />
                        Show Contact Details
                      </>
                    )}
                  </button>

                  {/* Contact Details - Smooth Animation */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    showContact ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}>
                    {showContact && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-50/50 rounded-xl p-4 border border-orange-100">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#001F3F] to-[#003366] rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                            <Building size={32} className="text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-3">VMRDA Plots</h4>
                          {client?.phoneNumber && (
                            <div className="flex items-center justify-center gap-2 bg-white rounded-lg px-4 py-2 mb-2 shadow-sm">
                              <Phone size={14} className="text-orange-500" />
                              <span className="text-sm font-medium text-gray-700">{client.phoneNumber}</span>
                            </div>
                          )}
                          {client?.email && (
                            <div className="flex items-center justify-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                              <Mail size={14} className="text-orange-500" />
                              <span className="text-sm font-medium text-gray-700">{client.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Schedule a Visit Form */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar size={18} className="text-orange-500" />
                      Schedule a Visit
                    </h4>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          placeholder="Your Name" 
                          onChange={handleChange} 
                          required 
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          placeholder="Your Email" 
                          onChange={handleChange} 
                          required 
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="tel" 
                          name="phoneNumber" 
                          placeholder="Your Phone" 
                          value={formData.phoneNumber} 
                          onChange={handleChange} 
                          required 
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                        <textarea 
                          name="message" 
                          placeholder="Message (Optional)" 
                          rows="3" 
                          value={formData.message} 
                          onChange={handleChange} 
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                        ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading} 
                        className={`w-full bg-gradient-to-r from-[#001F3F] to-[#003366] hover:from-[#002D5C] hover:to-[#004d99] text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Request a Callback
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Similar Properties Section */}
        {similarProperties?.length > 0 && (
          <section className="py-16 mt-8 relative">
            <div className="relative">
              <div className="text-center mb-10">
                <span className="inline-block bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wider border border-orange-200">
                  Similar Properties
                </span>
              </div>
              <h2 className="text-4xl font-serif font-bold text-center mb-12 text-gray-900">
                Properties You Might Like
              </h2>
              <div className="relative group">
                <button 
                  onClick={() => swiperRef.current?.slidePrev()} 
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white border-2 border-gray-200 hover:border-orange-500 text-gray-600 hover:text-orange-600 w-12 h-12 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} className="stroke-2" />
                </button>
                <button 
                  onClick={() => swiperRef.current?.slideNext()} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white border-2 border-gray-200 hover:border-orange-500 text-gray-600 hover:text-orange-600 w-12 h-12 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} className="stroke-2" />
                </button>
                <Swiper {...swiperConfig} className="similar-properties-swiper">
                  {similarProperties.map((property, idx) => (
                    <SwiperSlide key={property?.id}>
                      <article 
                        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 mx-2 my-4 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2"
                        onClick={() => handleSimilarPropertyClick(property)}
                      >
                        <div className="h-64 overflow-hidden relative">
                          <img 
                            src={getPhotoSrc(property?.photos)} 
                            alt={property?.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                            }}
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(property); }} 
                            className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                          >
                            <Heart className={`w-5 h-5 transition ${isFavorite(property?.id) ? "text-red-600 fill-red-600" : "text-gray-600 hover:text-red-400"}`} />
                          </button>
                          {property.availableStatus && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                {property.availableStatus}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors duration-300 mb-2 line-clamp-2">
                            {property?.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">{property?.address?.city}, {property?.address?.locality}</span>
                          </div>
                          {property?.profile && (
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                              {property?.profile?.bedrooms > 0 && (
                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                                  <Bed size={14} className="text-[#003366]" />
                                  <span>{property?.profile?.bedrooms}</span>
                                </div>
                              )}
                              {property?.profile?.bathrooms > 0 && (
                                <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                                  <Bath size={14} className="text-[#003366]" />
                                  <span>{property?.profile?.bathrooms}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                <Maximize size={14} className="text-[#003366]" />
                                <span>{property?.profile?.carpetArea || property?.profile?.plotArea} {property?.profile?.areaUnit}</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="text-left">
                              {property?.price ? (
                                <div className="text-xl font-bold text-orange-600">{formatPrice(property?.price)}</div>
                              ) : (
                                <button 
                                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-orange-200 transition-all duration-300 transform hover:scale-105" 
                                  onClick={(e) => { e.stopPropagation(); alert("Contact us for price!"); }}
                                >
                                  Contact Us
                                </button>
                              )}
                            </div>
                            <button className="bg-[#003366] hover:bg-[#004d99] text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                              View Details →
                            </button>
                          </div>
                        </div>
                      </article>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="flex justify-center mt-8">
                  <div className="bg-white rounded-full px-6 py-3 shadow-xl border border-gray-200">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => swiperRef.current?.slidePrev()} 
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-50 transition-all"><ChevronLeft size={16} /></div>
                        <span className="text-sm font-medium">Prev</span>
                      </button>
                      <div className="h-6 w-px bg-gray-300"></div>
                      <button 
                        onClick={() => swiperRef.current?.slideNext()} 
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group"
                      >
                        <span className="text-sm font-medium">Next</span>
                        <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-50 transition-all"><ChevronRight size={16} /></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Premium Small Reusable Components
const FeatureCardPremium = ({ icon, label, value }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-orange-200 hover:scale-105">
    <div className="flex justify-center mb-2">
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-full text-orange-600">
        {icon}
      </div>
    </div>
    <div className="text-lg font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const DetailCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300 hover:border-orange-200">
    <div className="text-orange-600">{icon}</div>
    <div className="flex-1">
      <span className="block text-xs text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  </div>
);

const SectionPremium = ({ title, children }) => (
  <div className="mt-8 pt-6 border-t border-gray-200">
    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
      {title}
    </h2>
    {children}
  </div>
);

// Sparkles icon component if not imported
const Sparkles = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
  </svg>
);

// PropertyDetail.js - Update the main export
export default function PropertyDetail({ title }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div> 
    }>
      <PropertyDetailContent title={title} />
    </Suspense>
  );
}