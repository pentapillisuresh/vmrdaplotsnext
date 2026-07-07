'use client';

import React, { useEffect } from "react";
import {
  Search,
  Eye,
  Handshake,
  KeyRound,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const steps = [
  {
    id: 1,
    title: "Search Properties",
    desc: "Browse through thousands of properties in your desired location with advanced filters.",
    icon: <Search className="w-6 h-6 text-white" />,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "View & Compare",
    desc: "Schedule viewings and compare different properties side by side with detailed insights.",
    icon: <Eye className="w-6 h-6 text-white" />,
    img: "./images/why1.jpeg",
  },
  {
    id: 3,
    title: "Make an Offer",
    desc: "Work with our expert agents to negotiate and get the best deal for your dream home.",
    icon: <Handshake className="w-6 h-6 text-white" />,
    img: "./images/why2.webp",
  },
  {
    id: 4,
    title: "Close the Deal",
    desc: "Complete the paperwork and get the keys to your new property with full support.",
    icon: <KeyRound className="w-6 h-6 text-white" />,
    img: "./images/why3.webp",
  },
];

const HowItWorks = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900"
            data-aos="fade-up"
          >
            How It Works
          </h2>
          <p
            className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Transform your property dreams into reality with our streamlined,
            professional process designed for your success.
          </p>
          <div
            className="w-20 h-1 bg-orange-500 mx-auto mt-5 rounded-full"
            data-aos="zoom-in"
            data-aos-delay="200"
          ></div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line */}
          <div
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-orange-400 via-orange-500 to-orange-400 transform -translate-x-[1.5px]"
            data-aos="fade-in"
          ></div>

          {/* Timeline Items */}
          <div className="space-y-20">
            {steps.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col lg:flex-row items-center gap-10 ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image Section */}
                  <div
                    className={`w-full lg:w-5/12 ${
                      isEven ? "lg:pr-20" : "lg:pl-20"
                    }`}
                    data-aos={isEven ? "fade-right" : "fade-left"}
                    data-aos-delay={100 + idx * 150}
                  >
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md group hover:border-orange-500 hover:shadow-xl transition-all duration-500">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="bg-orange-500 p-3 rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                          {item.icon}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div
                    className="hidden lg:flex absolute top-1/2 left-1/2 z-20"
                    style={{
                      transform:
                        "translate(-50%, -50%)", // pure center alignment
                    }}
                    data-aos="zoom-in"
                    data-aos-delay={250 + idx * 150}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-orange-500 border-4 border-white shadow-md"></div>
                      <div className="absolute inset-0 w-6 h-6 rounded-full bg-orange-500/40 animate-ping"></div>
                    </div>
                  </div>

                  {/* Text Section */}
                  <div
                    className={`w-full lg:w-5/12 ${
                      isEven ? "lg:pl-20" : "lg:pr-20"
                    }`}
                    data-aos={isEven ? "fade-left" : "fade-right"}
                    data-aos-delay={200 + idx * 150}
                  >
                    <h3
                      className="text-2xl font-serif font-semibold text-gray-900 mb-2"
                      data-aos="fade-up"
                      data-aos-delay={300 + idx * 150}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-gray-600 text-base leading-relaxed"
                      data-aos="fade-up"
                      data-aos-delay={400 + idx * 150}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="200">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-medium text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-orange-600">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
