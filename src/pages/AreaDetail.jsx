'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import areaData from '../data/areaData';
import { ArrowLeft, MapPin, Check, ChevronDown, ChevronUp } from 'lucide-react';

function AreaDetailContent() {
  const router = useRouter();
  const params = useParams();
  const areaName = params?.areaName;
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (!areaName) return;

    const formattedName = areaName
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const foundArea = areaData.find(a =>
      a.name.toLowerCase() === formattedName.toLowerCase()
    );

    setArea(foundArea);
    setLoading(false);
  }, [areaName]);

  const handleKeywordClick = (keyword) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('searchParams', JSON.stringify({
        searchKeyword: keyword,
        areaName: area.name
      }));
    }
    router.push('/properties');
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F3F]"></div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-3xl font-bold text-[#001F3F] mb-4">Area not found</h1>
        <Link href="/" className="text-[#001F3F] hover:text-orange-500 font-medium">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center text-[#001F3F] hover:text-orange-500 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to All Areas
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={area.image}
          alt={area.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Plots in {area.name}</h1>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-2" />
                <p className="text-lg">Visakhapatnam, Andhra Pradesh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200">

          {/* SEO Title */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001F3F] mb-3">
              {area.seoTitle}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {area.metaDescription}
            </p>
          </div>

          {/* Article */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-[#001F3F] mb-4">
              {area.name} Plots for Sale
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {area.article}
              </p>
            </div>
          </div>

          {/* Primary & Secondary Keywords - Clickable */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-[#001F3F] mb-4">
              Search Keywords
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {area.primarySecondaryKeywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleKeywordClick(keyword)}
                  className="flex items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-200 transition-all duration-300 group hover:border-orange-300 hover:shadow-md cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:ring-opacity-50"
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-6 h-6 rounded-full bg-[#001F3F] flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#001F3F] font-medium text-sm group-hover:text-orange-600 transition-colors line-clamp-2">
                      {keyword}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-500 italic">
              Click on any keyword to explore related projects
            </div>
          </div>

          {/* Suggested Article Sections */}
          {area.suggestedArticleSections && area.suggestedArticleSections.length > 0 && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-[#001F3F] mb-4">
                Suggested Article Sections
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {area.suggestedArticleSections.map((section, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-orange-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{section}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ Content */}
          {area.faqContent && area.faqContent.length > 0 && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-[#001F3F] mb-4">
                Frequently Asked Questions About Plots in {area.name}
              </h3>
              <div className="space-y-3">
                {area.faqContent.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <span className="font-semibold text-[#001F3F] pr-4">
                        {faq.question}
                      </span>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#001F3F] flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Internal Links */}
          {/* {area.recommendedInternalLinks && area.recommendedInternalLinks.length > 0 && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-[#001F3F] mb-4">
                Recommended Links
              </h3>
              <div className="flex flex-wrap gap-3">
                {area.recommendedInternalLinks.map((link, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-[#001F3F] px-4 py-2 rounded-full text-sm border border-gray-300"
                  >
                    {link}
                  </span>
                ))}
              </div>
            </div>
          )} */}

          {/* Nearby Areas */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-[#001F3F] mb-6">Explore Nearby Areas</h3>
            <div className="flex flex-wrap gap-3">
              {areaData
                .filter(a => a.id !== area.id)
                .slice(0, 4)
                .map(nearbyArea => (
                  <Link
                    key={nearbyArea.id}
                    href={`/area/${nearbyArea.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-gray-100 hover:bg-orange-100 text-[#001F3F] hover:text-orange-600 px-4 py-2 rounded-full transition-all duration-300 border border-gray-300"
                  >
                    {nearbyArea.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#001F3F] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">Ready to Invest in {area.name}?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get exclusive access to VMRDA-approved plots, expert guidance, and special pricing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-500 text-white hover:bg-orange-600 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                Book Site Visit
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-full transition-all duration-300">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for App Router
export default function AreaDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F3F]"></div>
      </div>
    }>
      <AreaDetailContent />
    </Suspense>
  );
}