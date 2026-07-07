'use client';

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import ApiService from "../hooks/ApiService";
import DOMPurify from "dompurify";

function BlogContent() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to strip HTML tags for excerpt
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Function to extract plain text from HTML for excerpt
  const getExcerpt = (html, maxLength = 150) => {
    const plainText = stripHtml(html);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  // Function to calculate read time
  const calculateReadTime = (html) => {
    if (!html) return "2 min read";
    const text = stripHtml(html);
    const wordCount = text.split(/\s+/).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const adminToken = localStorage.getItem('token');
      const res = await ApiService.get("/blogs", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });
      setBlogs(res.blogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white h-[500px]"
        style={{
          backgroundImage: `url('/images/blog.jpeg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl text-center">
            <span className="inline-block bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              Welcome to Realty Insights
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Real Estate Stories That Inspire
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Explore expert opinions, property market trends, and success stories that
              shape the future of real estate across residential, commercial, and
              industrial sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-slate-900 mb-4">
            Latest Real Estate Articles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with expert-written blogs covering investment insights,
            architectural trends, and property management tips.
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-500 text-lg">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No blogs available</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group block"
              >
                <article className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    {blog.photo ? (
                      <img
                        src={blog.photo}
                        alt={blog.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-800 to-slate-900 text-white text-2xl font-bold">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-block bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {blog.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {calculateReadTime(blog.description)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {blog.name}
                    </h3>
                    <div className="text-gray-600 mb-6 leading-relaxed flex-1 line-clamp-3 min-h-[72px]">
                      {blog.description ? (
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(getExcerpt(blog.description, 120))
                          }}
                        />
                      ) : (
                        "No description available."
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <span className="text-orange-500 font-semibold transition-colors duration-300 flex items-center gap-1 group-hover:gap-2">
                        Read More <span>→</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-4xl font-bold text-white mb-6">
            Stay Ahead in Real Estate
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Subscribe to our newsletter and get expert insights, investment trends, and
            property news straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500 transition-all"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
              Subscribe Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Wrap with Suspense for App Router
export default function Blog() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog page...</p>
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}