'use client';


import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, } from "react-icons/fi";
import BuyFormModal from "./BuyFormModal";
import DevelopmentFormModal from "./DevelopmentFormModal";

const Footer = () => {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isDevelopmentModalOpen, setIsDevelopmentModalOpen] = useState(false);

  // ✅ Updated Quick Links to include Investors & Development
  const quickLinks = [
    { name: "About Us", href: "#" },
    { name: "Contact Us", href: "#" },
    // { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Investors", modal: "buy" }, // opens BuyFormModal
    { name: "Development", modal: "development" }, // opens DevelopmentFormModal
  ];

  const getInTouch = [
    { name: "Feedback", href: "#" },
    { name: "Support", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Advertise", href: "#" },
  ];

  const popularCities = [
    { name: "Properties in Visakhapatnam", href: "#" },
    { name: "Properties in srikakulam", href: "#" },
    { name: "Properties in vizinagaram", href: "#" },
    { name: "Properties in duvvada", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* --- Top Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo + Social */}
          <div className="animate-fadeIn">
            <div className="flex items-center mb-4">
              <img src="/images/vizaglogo.jpeg" alt="vmrdaplots Logo" className="h-15 w-auto rounded" />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              We are committed to connect quality homes to quality buyers.
              Helping you find your dream property.
            </p>
            <div className="flex space-x-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* ✅ Quick Links (with Investors & Development) */}
          <div className="animate-fadeIn" style={{ animationDelay: "100ms" }}>
            <h3 className="text-white font-serif font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {link.modal ? (
                    // handle modal triggers for Investors/Development
                    <button
                      onClick={() =>
                        link.modal === "buy"
                          ? setIsBuyModalOpen(true)
                          : setIsDevelopmentModalOpen(true)
                      }
                      className="hover:text-orange-500 transition-colors duration-300 flex items-center group w-full text-left"
                    >
                      <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="hover:text-orange-500 transition-colors duration-300 flex items-center group"
                    >
                      <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="animate-fadeIn" style={{ animationDelay: "200ms" }}>
            <h3 className="text-white font-serif font-bold text-lg mb-6">Get In Touch</h3>
            <ul className="space-y-3">
              {getInTouch.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-orange-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="animate-fadeIn" style={{ animationDelay: "300ms" }}>
            <h3 className="text-white font-serif font-bold text-lg mb-6">Popular Cities</h3>
            <ul className="space-y-3">
              {popularCities.map((city, index) => (
                <li key={index}>
                  <a
                    href={city.href}
                    className="hover:text-orange-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                    {city.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Contact Info --- */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start space-x-3 animate-fadeIn">
              <FiMapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-1">Visit Us</h4>
                <p className="text-sm text-gray-400">Visakhapatnam, Andhra Pradesh, India</p>
              </div>
            </div>
            <div
              className="flex items-start space-x-3 animate-fadeIn"
              style={{ animationDelay: "100ms" }}
            >
              <FiPhone className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-1">Call Us</h4>
                <p className="text-sm text-gray-400">+91 7989834055</p>
              </div>
            </div>
            <div
              className="flex items-start space-x-3 animate-fadeIn"
              style={{ animationDelay: "200ms" }}
            >
              <FiMail className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-1">Email Us</h4>
                <p className="text-sm text-gray-400">info@vmrdaplots.com</p>
              </div>
            </div>
          </div>

          {/* --- Footer Bottom --- */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 vmrdaplots. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="/privacy-policy"
                className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-conditions"
                className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-300"
              >
                Terms & Conditions
              </a>
              {/* <a
                href="/delete-account"
                className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-300"
              >
                delete account
              </a> */}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modals (Buy + Development) */}
      <BuyFormModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
      <DevelopmentFormModal
        isOpen={isDevelopmentModalOpen}
        onClose={() => setIsDevelopmentModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
