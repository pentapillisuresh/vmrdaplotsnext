'use client';

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ApiService from "../hooks/ApiService";
import DOMPurify from "dompurify";
import { ArrowLeft, Calendar, Clock, Share2, Link as LinkIcon, Copy, Check, Eye } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";

function BlogDetailContent() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Function to safely render HTML
  const createMarkup = (html) => {
    if (!html) return { __html: "" };
    return {
      __html: DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          "h1", "h2", "h3", "h4", "h5", "h6",
          "p", "br", "strong", "b", "em", "i", "u", "strike",
          "ul", "ol", "li", "a", "img", "div", "span",
          "blockquote", "code", "pre", "table", "thead", "tbody", "tr", "th", "td"
        ],
        ALLOWED_ATTR: [
          "href", "target", "rel", "src", "alt", "title", "width", "height",
          "class", "style", "align", "color", "background"
        ]
      })
    };
  };

  // Function to strip HTML tags for excerpt
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Function to get excerpt
  const getExcerpt = (html, maxLength = 100) => {
    const plainText = stripHtml(html);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  // Calculate read time
  const calculateReadTime = (html) => {
    if (!html) return "2 min read";
    const text = stripHtml(html);
    const wordCount = text.split(/\s+/).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Fetch blog details
  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('token');
      const res = await ApiService.get(`/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });
      setBlog(res.blog);
      
      // Also fetch related blogs
      const allBlogsRes = await ApiService.get("/blogs", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Filter out current blog and get 3 related blogs
      const related = allBlogsRes.blogs
        .filter(b => b.id !== res.blog.id)
        .slice(0, 3);
      setRelatedBlogs(related);
      
      // Set share URL
      setShareUrl(`${window.location.origin}/blog/${id}`);
      
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Blog not found or error loading blog.");
    } finally {
      setLoading(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Share on social media
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = blog ? `Check out: ${blog.name}` : 'Check out this blog post';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  // Native Web Share API
  const shareViaWebAPI = () => {
    if (navigator.share && blog) {
      navigator.share({
        title: blog.name,
        text: getExcerpt(blog.description, 150),
        url: shareUrl,
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.push('/blog')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/blog')}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Blogs</span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                blog.status === 'published' ? 'bg-green-100 text-green-800' :
                blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {blog.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Blog Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{calculateReadTime(blog.description)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">Views: {blog.views || 0}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.photo && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={blog.photo}
              alt={blog.name}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={createMarkup(blog.description)}
          />
        </article>

        {/* Additional Content */}
        {blog.content && (
          <div className="mb-12">
            <div 
              className="prose prose-slate max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        )}

        {/* Share Section */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Share this article</h3>
              <p className="text-gray-600">Help others discover this insightful post</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Web Share API */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  onClick={shareViaWebAPI}
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              )}
              
              {/* Social Media Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={shareOnFacebook}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  title="Share on Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </button>
                
                <button
                  onClick={shareOnTwitter}
                  className="p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                  title="Share on Twitter"
                >
                  <BsTwitter className="w-5 h-5" />
                </button>
                
                <button
                  onClick={shareOnLinkedIn}
                  className="p-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                  title="Share on LinkedIn"
                >
                  <LiaLinkedin className="w-5 h-5" />
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className={`p-2.5 ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-800'} text-white rounded-lg transition-colors flex items-center gap-2`}
                  title="Copy link"
                >
                  {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Link Box */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 truncate">{shareUrl}</span>
              <button
                onClick={copyToClipboard}
                className="ml-2 px-3 py-1.5 text-sm bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-md transition-colors flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  href={`/blog/${relatedBlog.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    {relatedBlog.photo && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={relatedBlog.photo}
                          alt={relatedBlog.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {relatedBlog.name}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {getExcerpt(relatedBlog.description, 80)}
                      </p>
                      <div className="mt-3 text-xs text-gray-500">
                        {new Date(relatedBlog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blogs Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/blog')}
            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            View All Blogs
          </button>
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Real Estate Insights
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Subscribe to our newsletter for the latest blog posts, market trends, and expert analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500 transition-all"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
              Subscribe Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Wrap with Suspense because useParams requires it in App Router
export default function BlogDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BlogDetailContent />
    </Suspense>
  );
}