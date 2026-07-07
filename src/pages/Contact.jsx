'use client';

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ApiService from "../hooks/ApiService";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

function Contact() {
  // ✅ Initialize AOS animation
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });


  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const payload = {
      // propertyId: property.id || null, // fallback if not provided
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      message: formData.message,
      leadType: "callback", // or "inquiry" / "callback" etc.
    }
    try {
      const response = await ApiService.post("/leads", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("rrr::", response)
      if (response) {
        alert("lead updated successfully")
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });

        setTimeout(() => {
          setStatus("")
        }, 2000);
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

  return (
    <>
      {/* <Header /> */}
      <div className="bg-white">
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center text-white py-24 overflow-hidden"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/premium-photo/buildings-by-sea-against-sky_1048944-24842044.jpg?w=1060')",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center" data-aos="fade-up">
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                Contact Us
              </h1>
              <p className="font-roboto text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                VMRDA Plots in Vizag
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info + Form Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Left Column - Contact Info */}
              <div data-aos="fade-right">
                <h2 className="text-4xl font-serif font-bold text-[#001F3F] mb-8">
                  Get In Touch
                </h2>
                <p className="font-roboto text-lg text-gray-700 mb-12 leading-relaxed">
                  Looking for VMRDA approved plots in Vizag?
                  Contact vmrdaplots.com today for the best deals on
                  VMRDA open plots in Visakhapatnam.

                </p>

                <div className="space-y-8">
                  {/* Address */}
                  <div
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-serif font-bold text-[#001F3F] mb-2">
                        Office Address
                      </h3>
                      <p className="font-roboto text-gray-700 leading-relaxed">
                        123 Beach Road, Visakhapatnam
                        <br />
                        Andhra Pradesh 530001, India
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-serif font-bold text-[#001F3F] mb-2">
                        Phone Number
                      </h3>
                      <p className="font-roboto text-gray-700 leading-relaxed">
                        +91 7989834055
                        <br />

                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-serif font-bold text-[#001F3F] mb-2">
                        Email Address
                      </h3>
                      <p className="font-roboto text-gray-700 leading-relaxed">
                        info@vmrda plots
                        <br />
                        sales@vmrda plots
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div
                    className="flex items-start"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-serif font-bold text-[#001F3F] mb-2">
                        Business Hours
                      </h3>
                      <p className="font-roboto text-gray-700 leading-relaxed">
                        Monday - Saturday: 9:00 AM - 6:00 PM
                        <br />
                        Sunday: By Appointment Only
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div data-aos="fade-left">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                  <h3 className="text-3xl font-serif font-bold text-[#001F3F] mb-8">
                    Send Us a Message
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block font-roboto text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors duration-300"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block font-roboto text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors duration-300"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block font-roboto text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors duration-300"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block font-roboto text-sm font-medium text-gray-700 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF6B35] focus:outline-none transition-colors duration-300 resize-none"
                        placeholder="Tell us about your requirements"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FF6B35] hover:bg-[#e55a28] text-white font-roboto text-lg font-medium py-4 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location Section with Google Map */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12" data-aos="fade-up">
              <h2 className="text-4xl font-serif font-bold text-[#001F3F] mb-4">
                Visit Our Office
              </h2>
              <p className="font-roboto text-lg text-gray-700">
                We welcome you to visit us at our Visakhapatnam office
              </p>
            </div>

            <div
              className="rounded-2xl overflow-hidden shadow-2xl h-96"
              data-aos="zoom-in"
            >
              <iframe
                title="Vizag Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.479154835142!2d83.29108871485656!3d17.686816988104716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a395f1f3f9f9f9f%3A0xf00000000000000!2sVisakhapatnam%2C%20Andhra%20Pradesh%2C%20India!5e0!3m2!1sen!2sus!4v1707648000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Contact;
