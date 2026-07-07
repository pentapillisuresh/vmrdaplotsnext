// src/components/AboutVMRDA.js
import React from "react";

function AboutVMRDA() {
  return (
    <section className="md:py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10" data-aos="fade-up">
          <span className="inline-block bg-orange-50 text-orange-600 px-4 py-1 rounded-full font-medium text-sm  tracking-wide">
            Why Choose Us
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-snug">
            Premium <span className="text-orange-600">VMRDA Approved Plots</span> in Prime Vizag
          </h2>
          <div className="h-1 w-16 bg-orange-500 mb-6 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Side Image with Animation */}
          <div
            className="w-full lg:w-1/2"
            data-aos="fade-right"
            data-aos-duration="800"
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                alt="VMRDA approved plots in Vizag - Prime locations in Visakhapatnam"
                className="w-full h-[400px] md:h-[500px] object-cover rounded-xl transition-all duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-50/80 to-transparent h-32"></div>

              {/* Orange Badge */}
              <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md border border-orange-100">
                <span className="text-orange-600 font-bold text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  VMRDA Approved
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div
            className="w-full lg:w-1/2"
            data-aos="fade-left"
            data-aos-duration="800"
            data-aos-delay="200"
          >
            <span className="inline-block px-3 py-1.5 bg-orange-50 text-orange-600 font-medium rounded-md mb-3 text-xs tracking-wide uppercase">
              Trusted Real Estate Platform
            </span>

            <div className="space-y-5">
              <p className="text-base text-gray-700 leading-relaxed">
                <strong className="text-gray-900">vmrdaplots.com</strong> is a trusted real estate platform offering{" "}
                <span className="text-orange-600 font-medium">VMRDA approved plots in Vizag</span> at prime and fast-developing locations.
                We provide legally approved <span className="text-orange-600 font-medium">VMRDA open plots in Visakhapatnam</span> with
                clear title, DTCP & VMRDA approvals.
              </p>

              <p className="text-base text-gray-700 leading-relaxed">
                Our <span className="text-orange-600 font-medium">VMRDA plots in Vizag</span> are ideal for residential and investment purposes.
                We offer <span className="text-orange-600 font-medium">VMRDA approved plots Vizag</span> with excellent road connectivity,
                infrastructure and future growth potential.
              </p>

              <p className="text-base text-gray-700 leading-relaxed">
                If you are looking for <span className="text-orange-600 font-medium">VMRDA approved layouts in Vizag</span>,
                vmrdaplots.com is the right choice for safe and secure land investment.
              </p>



              {/* Key Features Grid - Orange Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-colors duration-300">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-sm text-gray-800">
                    <span className="font-medium">VMRDA approved plots in Bhogapuram</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-colors duration-300">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-sm text-gray-800">
                    <span className="font-medium">VMRDA approved plots in Vizag</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-colors duration-300">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-sm text-gray-800">
                    <span className="font-medium">VMRDA residential plots in vizag</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-colors duration-300">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-sm text-gray-800">DTCP & VMRDA Approvals</span>
                </div>
              </div>

              {/* CTA Button - Orange Theme */}
              <div className="pt-6">
                <button onClick={() => window.location.href = '/project'}

                  className="group px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-base inline-flex items-center gap-2">
                  Explore VMRDA Plots in Vizag
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <p className="text-gray-500 text-xs mt-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call for a free site visit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutVMRDA;