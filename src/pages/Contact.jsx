'use client';

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ApiService from "../hooks/ApiService";

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
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      message: formData.message,
      leadType: "callback",
    }
    try {
      const response = await ApiService.post("/leads", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("rrr::", response)
      if (response) {
        alert("Lead submitted successfully!")
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
      <div className="bg-white">
        {/* Hero Section - Premium Banner */}
        <section
          className="relative bg-cover bg-center bg-no-repeat text-white h-[450px] flex items-center"
          style={{
            backgroundImage: `url('./images/contact.png')`,
          }}
        >
          {/* Gradient Overlay - Premium Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
            <div className="text-left" data-aos="fade-up">
              <div className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6 shadow-lg">
                Get in Touch
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 leading-tight">
                Contact Us
              </h1>
              <p className="font-roboto text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed">
                VMRDA Plots in Vizag — Your Trusted Real Estate Partner
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-orange-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">100% Verified Plots</span>
                </div>
                <div className="w-px h-6 bg-gray-600"></div>
                <div className="flex items-center gap-2 text-orange-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">VMRDA Approved</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Contact Info + Form Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Left Column - Contact Info */}
              <div data-aos="fade-right">
                <div className="mb-8">
                  <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                    Contact Information
                  </span>
                  <h2 className="text-4xl font-serif font-bold text-[#001F3F] mb-4">
                    Get In Touch
                  </h2>
                  <div className="w-16 h-1 bg-orange-500 rounded-full"></div>
                </div>
                
                <p className="font-roboto text-lg text-gray-700 mb-12 leading-relaxed">
                  Looking for VMRDA approved plots in Vizag? Contact vmrdaplots.com today 
                  for the best deals on VMRDA open plots in Visakhapatnam.
                </p>

                <div className="space-y-8">
                  {/* Address */}
                  <div
                    className="flex items-start group"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-orange-500 group-hover:bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 transition-all duration-300">
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
                      <h3 className="text-xl font-serif font-bold text-[#001F3F] mb-2 group-hover:text-orange-500 transition-colors">
                        Office Address
                      </h3>
                      <p className="font-roboto text-gray-600 leading-relaxed">
                        Door No: SY NO 58/1, near Water Tank
                        <br />
                        Tallavalasa, Bheemunipatnam
                        <br />
                        Andhra Pradesh 531162, India
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div
                    className="flex items-start group"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-orange-500 group-hover:bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 transition-all duration-300">
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
                      <h3 className="text-xl font-serif font-bold text-[#001F3F] mb-2 group-hover:text-orange-500 transition-colors">
                        Phone Number
                      </h3>
                      <p className="font-roboto text-gray-600 leading-relaxed">
                        +91 7989834055
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div
                    className="flex items-start group"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-orange-500 group-hover:bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 transition-all duration-300">
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
                      <h3 className="text-xl font-serif font-bold text-[#001F3F] mb-2 group-hover:text-orange-500 transition-colors">
                        Email Address
                      </h3>
                      <p className="font-roboto text-gray-600 leading-relaxed">
                        info@vmrdaplots.com
                        <br />
                        sales@vmrdaplots.com
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div
                    className="flex items-start group"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-orange-500 group-hover:bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 transition-all duration-300">
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
                      <h3 className="text-xl font-serif font-bold text-[#001F3F] mb-2 group-hover:text-orange-500 transition-colors">
                        Business Hours
                      </h3>
                      <p className="font-roboto text-gray-600 leading-relaxed">
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
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100 relative overflow-hidden">
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-50 rounded-full translate-y-16 -translate-x-16"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-3xl font-serif font-bold text-[#001F3F] mb-2">
                      Send Us a Message
                    </h3>
                    <p className="text-gray-500 mb-8 font-roboto">
                      We'll get back to you within 24 hours
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block font-roboto text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-[#333333] border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block font-roboto text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-[#333333] border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                          placeholder="Enter your email address"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block font-roboto text-sm font-medium text-gray-700 mb-2"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-[#333333] border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block font-roboto text-sm font-medium text-gray-700 mb-2"
                        >
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 border-2  text-[#333333] border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300 resize-none"
                          placeholder="Tell us about your requirements..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-roboto text-lg font-medium py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                      
                      {status && (
                        <div className={`text-center p-3 rounded-lg ${
                          status.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {status}
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location Section with Google Map */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12" data-aos="fade-up">
              <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                Find Us
              </span>
              <h2 className="text-4xl font-serif font-bold text-[#001F3F] mb-4">
                Visit Our Office
              </h2>
              <div className="w-16 h-1 bg-orange-500 rounded-full mx-auto"></div>
              <p className="font-roboto text-lg text-gray-600 mt-4">
                We welcome you to visit us at our Bheemunipatnam office
              </p>
            </div>

            <div
              className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
              data-aos="zoom-in"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3796.488183929933!2d83.41130097517701!3d17.909370283069602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39590c9803e9c5%3A0x8f9285b7b0e95ceb!2sVMRDA%20PLOTS!5e0!3m2!1sen!2sin!4v1783521494291!5m2!1sen!2sin" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
                title="VMRDA PLOTS Office Location"
                className="w-full h-[450px]"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Contact;