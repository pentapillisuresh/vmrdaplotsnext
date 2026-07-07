'use client';

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Home, Compass, Share2, Bed, Bath, Maximize,
  Building, MapPin, CheckCircle, Phone, Mail, Calendar, ChevronDown, ChevronUp,
  Monitor, DoorClosed, Presentation, Heart, ChevronLeft, ChevronRight
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
  // const params = useParams();
  // const slug = params?.title;
  const slug = propTitle; // Use the prop directly
  const router = useRouter();
  const swiperRef = useRef(null);

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

  let galleryImages = [];
  try {
    if (Array.isArray(property?.photos)) {
      galleryImages = property.photos;
    } else if (typeof property?.photos === 'string' && property.photos.startsWith('[')) {
      galleryImages = JSON.parse(property.photos);
    } else if (property?.photos) {
      galleryImages = [property.photos];
    } else {
      galleryImages = [category?.photo];
    }
  } catch (err) {
    console.error('Error parsing photos:', err);
    galleryImages = [category?.photo];
  }

  const safeShow = (val) => val !== null && val !== undefined && val !== "" && val !== 0;

  const handleBackToListings = () => {
    router.push('/properties-list');
  };

  const handleSimilarPropertyClick = (property) => {
    sessionStorage.setItem('selectedProperty', JSON.stringify(property));
    const slug = property.slug;
    router.push(`/property/${slug}`);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-[#003366] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={handleBackToListings}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Listings
          </button>
          <h2 className="font-semibold text-lg">{category.name || "Property Details"}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-900">
                <img
                  src={galleryImages[selectedImage]}
                  alt={property?.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property);
                  }}
                  className="absolute top-3 right-3 z-20"
                >
                  <Heart
                    className={`w-8 h-8 drop-shadow-md transition ${isFavorite(property?.id)
                      ? "text-red-600 fill-red-600"
                      : "text-white hover:text-red-400"
                    }`}
                  />
                </button>
                {selectedImage > 0 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full"
                  >
                    <ArrowLeft size={24} className="text-[#003366]" />
                  </button>
                )}
                {selectedImage < galleryImages.length - 1 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full"
                  >
                    <ArrowRight size={24} className="text-[#003366]" />
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                      ? "border-orange-600 ring-2 ring-orange-200"
                      : "border-gray-300 hover:border-orange-400"
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`View ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#003366] mb-2">{property?.title}</h1>
                  <h3 className="text-sm font-bold text-[#003366] mb-2">{property?.propertyName}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} className="text-orange-500" />
                    <span className="text-lg">
                      {address?.locality && `${address?.locality}, `}
                      {address?.city && `${address?.city}`}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {property?.price ? (
                    <div className="text-3xl font-bold text-orange-600">{formatPrice(property?.price)}</div>
                  ) : (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-md transition-all"
                      onClick={() => alert("Contact us for price!")}
                    >
                      Contact Us for Price
                    </button>
                  )}
                </div>
              </div>

              {/* Share Section */}
              <div className="flex items-center justify-between py-4 border-y border-gray-200 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">Share this property:</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button onClick={shareOnWhatsApp} className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-full transition-colors">
                      <img src={SocialIcons.whatsapp} alt="WhatsApp" className="w-5 h-5 filter invert" />
                    </button>
                    <button onClick={shareOnFacebook} className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                      <img src={SocialIcons.facebook} alt="Facebook" className="w-5 h-5 filter invert" />
                    </button>
                    <button onClick={shareOnTwitter} className="w-10 h-10 flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full transition-colors">
                      <img src={SocialIcons.twitter} alt="Twitter" className="w-5 h-5 filter invert" />
                    </button>
                    <button onClick={shareOnLinkedIn} className="w-10 h-10 flex items-center justify-center bg-blue-800 hover:bg-blue-900 rounded-full transition-colors">
                      <img src={SocialIcons.linkedin} alt="LinkedIn" className="w-5 h-5 filter invert" />
                    </button>
                    <button onClick={shareOnTelegram} className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full transition-colors">
                      <img src={SocialIcons.telegram} alt="Telegram" className="w-5 h-5 filter invert" />
                    </button>
                    <button onClick={shareViaEmail} className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full transition-colors">
                      <img src={SocialIcons.email} alt="Email" className="w-5 h-5 filter invert" />
                    </button>
                    <button onClick={shareViaNative} className="w-10 h-10 flex items-center justify-center bg-gray-600 hover:bg-gray-700 rounded-full transition-colors">
                      <img src={SocialIcons.share} alt="Share" className="w-5 h-5 filter invert" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
                {category.name === "Plot" || category.name === "Land" ? (
                  <>
                    {category.name !== "Land" ? (
                      safeShow(profile?.plotArea) && (
                        <FeatureCard
                          icon={<Maximize size={24} />}
                          label="Plot Area"
                          value={`${profile?.plotArea} ${profile?.areaUnit || "sqft"}`}
                        />
                      )
                    ) : (
                      safeShow(profile?.landArea) && (
                        <FeatureCard
                          icon={<Maximize size={24} />}
                          label="Land Area"
                          value={`${profile?.landArea} ${profile?.areaUnit || "sqft"}`}
                        />
                      )
                    )}
                    {safeShow(profile?.facing) && (
                      <FeatureCard
                        icon={<Compass size={24} />}
                        label="Facing"
                        value={profile?.facing}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {safeShow(profile?.bedrooms) && (
                      <FeatureCard icon={<Bed size={24} />} label="Bedrooms" value={profile?.bedrooms} />
                    )}
                    {safeShow(profile?.bathrooms) && (
                      <FeatureCard icon={<Bath size={24} />} label="Bathrooms" value={profile?.bathrooms} />
                    )}
                    {safeShow(profile?.carpetArea) && (
                      <FeatureCard
                        icon={<Maximize size={24} />}
                        label="Carpet Area"
                        value={`${profile?.carpetArea} ${profile?.areaUnit || "sqft"}`}
                      />
                    )}
                    {safeShow(profile?.workstations) && (
                      <FeatureCard
                        icon={<Monitor size={24} />}
                        label="Work Station"
                        value={profile?.workstations}
                      />
                    )}
                    {safeShow(profile?.cabins) && (
                      <FeatureCard
                        icon={<DoorClosed size={24} />}
                        label="Cabin"
                        value={profile?.cabins}
                      />
                    )}
                    {safeShow(profile?.conferenceRooms) && (
                      <FeatureCard
                        icon={<Presentation size={24} />}
                        label="Meeting Rooms"
                        value={profile?.conferenceRooms}
                      />
                    )}
                    {safeShow(profile?.status) && (
                      <FeatureCard icon={<Building size={24} />} label="Status" value={profile?.status} />
                    )}
                  </>
                )}
              </div>

              {/* Property Details */}
              <Section title="Property Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {safeShow(category.name) && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <span className="block text-sm text-gray-500">Property Type</span>
                        <span className="text-[#003366] font-medium">{category.name}</span>
                      </div>
                    </div>
                  )}
                  {safeShow(address?.locality) && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <span className="block text-sm text-gray-500">Locality</span>
                        <span className="text-[#003366] font-medium">{address.locality}</span>
                      </div>
                    </div>
                  )}
                  {safeShow(address?.city) && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <span className="block text-sm text-gray-500">City</span>
                        <span className="text-[#003366] font-medium">{address.city}</span>
                      </div>
                    </div>
                  )}
                  {safeShow(profile?.totalFloors) && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <span className="block text-sm text-gray-500">Total Floors</span>
                        <span className="text-[#003366] font-medium">{profile.totalFloors}</span>
                      </div>
                    </div>
                  )}
                  {safeShow(profile?.furnishedStatus) && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <span className="block text-sm text-gray-500">Furnished Status</span>
                        <span className="text-[#003366] font-medium">{profile.furnishedStatus}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              {/* Nearby Places - IMPORTANT: Keep this section */}
              {Array.isArray(address?.near_by) && address.near_by.length > 0 && (
                <Section title="Nearby Places">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {address.near_by.map((place, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle size={20} className="text-orange-600" />
                        <div className="flex-1">
                          <span className="text-[#003366] font-medium">{place.info}</span>
                          {place.distance && (
                            <span className="block text-sm text-gray-500 mt-1">{place.distance}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Amenities - IMPORTANT: Keep this section */}
              {Array.isArray(property?.amenities) && property?.amenities.length > 0 && (
                <Section title="Amenities & Features">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {property?.amenities.map((a, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle size={20} className="text-orange-600" />
                        <span className="text-[#003366] font-medium">{a}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Approved By - Additional Section */}
              {property?.approvedBy && (
                <Section title="Approved By">
                  <div className="flex flex-wrap gap-2">
                    {typeof property.approvedBy === 'string' 
                      ? property.approvedBy.split(',').map((item, idx) => (
                          <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            {item.trim()}
                          </span>
                        ))
                      : Array.isArray(property.approvedBy) && property.approvedBy.map((item, idx) => (
                          <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            {item}
                          </span>
                        ))
                    }
                  </div>
                </Section>
              )}

              {/* Overview */}
              {safeShow(property?.description) && (
                <Section title="Overview">
                  <div className="text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">{getTruncatedDescription(property?.description)}</p>
                    {property?.description && property.description.length > 300 && (
                      <button onClick={toggleDescription} className="mt-3 flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium transition-colors">
                        {showFullDescription ? <><ChevronUp size={16} /> Show Less</> : <><ChevronDown size={16} /> Read More</>}
                      </button>
                    )}
                  </div>
                </Section>
              )}

              {/* Map Section */}
              <Section title="Location on Map">
                <PropertyMap lat={address?.lat} lon={address?.lon} />
              </Section>
            </div>
          </div>

          {/* Right Section - Contact */}
          {fromUser !== 'client' && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-5 sticky top-8">
                {showContact && (
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#003366] to-[#004d99] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Building size={36} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#003366] mb-1">VMRDA Plots</h3>
                    {client?.phoneNumber && (
                      <p className="text-sm text-gray-600">📞 {client.phoneNumber}</p>
                    )}
                    {client?.email && (
                      <p className="text-sm text-gray-600">✉️ {client.email}</p>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  <Phone size={20} /> {!showContact ? "Show Contact Details" : "Hide Contact Details"}
                </button>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-[#003366] mb-4">Schedule a Visit</h4>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" name="name" value={formData.name} placeholder="Your Name" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    <input type="email" name="email" value={formData.email} placeholder="Your Email" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    <input type="tel" name="phoneNumber" placeholder="Your Phone" value={formData.phoneNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    <textarea name="message" placeholder="Message (Optional)" rows="3" value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"></textarea>
                    <button type="submit" disabled={loading} className={`w-full bg-[#003366] hover:bg-[#004d99] text-white py-3 rounded-lg font-semibold transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
                      {loading ? "Submitting..." : "Request a Callback"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Similar Properties Section */}
        {similarProperties?.length > 0 && (
          <section className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-4">
                <span className="inline-block bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-medium text-sm uppercase tracking-wide">
                  Similar Properties
                </span>
              </div>
              <h2 className="text-4xl md:text-4xl font-serif font-extrabold text-center mb-12 text-gray-900">
                Similar Properties You Might Like
              </h2>
              <div className="relative group">
                <button onClick={() => swiperRef.current?.slidePrev()} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white border border-gray-200 hover:border-orange-500 text-gray-600 hover:text-orange-600 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                  <ChevronLeft size={24} className="stroke-2" />
                </button>
                <button onClick={() => swiperRef.current?.slideNext()} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white border border-gray-200 hover:border-orange-500 text-gray-600 hover:text-orange-600 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                  <ChevronRight size={24} className="stroke-2" />
                </button>
                <Swiper {...swiperConfig} className="similar-properties-swiper">
                  {similarProperties.map((property, idx) => (
                    <SwiperSlide key={property?.id}>
                      <article className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group-hover:shadow-2xl transition-all duration-300 mx-2 my-4 border border-gray-100 hover:border-orange-200" onClick={() => handleSimilarPropertyClick(property)}>
                        <div className="h-56 overflow-hidden relative">
                          <img 
                            src={getPhotoSrc(property?.photos)} 
                            alt={property?.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                            }}
                          />
                          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(property); }} className="absolute top-3 right-3 z-10">
                            <Heart className={`w-7 h-7 drop-shadow-md transition ${isFavorite(property?.id) ? "text-red-600 fill-red-600" : "text-white hover:text-red-400"}`} />
                          </button>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-[#003366] group-hover:text-orange-600 transition-colors mb-2 line-clamp-2">{property?.title}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">{property?.address?.city}, {property?.address?.locality}</span>
                          </div>
                          {property?.profile && (
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                              {property?.profile?.bedrooms > 0 && (
                                <div className="flex items-center gap-1"><Bed size={16} className="text-[#003366]" /><span>{property?.profile?.bedrooms}</span></div>
                              )}
                              {property?.profile?.bathrooms > 0 && (
                                <div className="flex items-center gap-1"><Bath size={16} className="text-[#003366]" /><span>{property?.profile?.bathrooms}</span></div>
                              )}
                              <div className="flex items-center gap-1">
                                <Maximize size={16} className="text-[#003366]" />
                                <span>{property?.profile?.carpetArea || property?.profile?.plotArea} {property?.profile?.areaUnit}</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="text-right">
                              {property?.price ? <div className="text-2xl font-bold text-orange-600">{formatPrice(property?.price)}</div> :
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-md transition-all" onClick={(e) => { e.stopPropagation(); alert("Contact us for price!"); }}>Contact Us</button>
                              }
                            </div>
                            <button className="text-[#003366] hover:text-orange-600 font-semibold transition-colors text-sm">View Details →</button>
                          </div>
                        </div>
                      </article>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="flex justify-center mt-8">
                  <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
                    <div className="flex items-center gap-6">
                      <button onClick={() => swiperRef.current?.slidePrev()} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group">
                        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-50 transition-all"><ChevronLeft size={16} /></div>
                        <span className="text-sm font-medium">Prev</span>
                      </button>
                      <div className="h-4 w-px bg-gray-300"></div>
                      <button onClick={() => swiperRef.current?.slideNext()} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group">
                        <span className="text-sm font-medium">Next</span>
                        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-50 transition-all"><ChevronRight size={16} /></div>
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

// Small Reusable Components
const FeatureCard = ({ icon, label, value }) => (
  <div className="text-center">
    <div className="flex justify-center mb-2">
      <div className="bg-blue-50 p-3 rounded-full text-[#003366]">{icon}</div>
    </div>
    <div className="text-lg font-bold text-[#003366]">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mt-6">
    <h2 className="text-2xl font-bold text-[#003366] mb-4">{title}</h2>
    {children}
  </div>
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