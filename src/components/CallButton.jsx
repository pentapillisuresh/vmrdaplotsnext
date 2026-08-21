"use client";

import { FaPhoneAlt } from "react-icons/fa";

export default function CallButton() {
  const phoneNumber = "7989834055";

  const callUrl = `tel:${phoneNumber}`;

  return (
    <a
      href={callUrl}
      className="group"
      aria-label="Call us"
    >
      <div className="relative">
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-40"></span>

        {/* Button */}
        <div className="relative w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
          <FaPhoneAlt className="text-white text-3xl" />
        </div>
      </div>
    </a>
  );
}