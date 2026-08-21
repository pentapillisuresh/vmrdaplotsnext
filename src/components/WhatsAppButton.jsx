"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "7989834055"; // Replace with your WhatsApp number
  const message = "Hi, I'm interested in your VMRDA plots.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40"></span>

        {/* Button */}
        <div className="relative w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
          <FaWhatsapp className="text-white text-4xl" />
        </div>
      </div>
    </a>
  );
}