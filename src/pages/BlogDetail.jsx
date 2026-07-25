'use client';

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ApiService from "../hooks/ApiService";
import DOMPurify from "dompurify";
import { ArrowLeft, Calendar, Clock, Share2, Link as LinkIcon, Copy, Check, Eye, User, Tag, Heart, MessageCircle } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
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
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

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
      setLikesCount(res.blog.likes || 0);
      
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

  // Handle like
  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md p-10 bg-white rounded-2xl shadow-2xl border border-gray-100">
          <div className="text-7xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.push('/blog')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 mx-auto shadow-lg shadow-orange-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation Bar - Premium */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/blog')}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-all duration-300 group"
            >
              <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium hidden sm:inline">Back to Blogs</span>
            </button>
            
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                blog.status === 'published' ? 'bg-green-100 text-green-700' :
                blog.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {blog.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Blog Header - Premium */}
        <header className="mb-12">
          {/* Category Badge */}
          {blog.category && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                <Tag className="w-4 h-4" />
                {blog.category.name || "Real Estate"}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {blog.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-100 rounded-full">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-100 rounded-full">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{calculateReadTime(blog.description)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-100 rounded-full">
                <Eye className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{blog.views || 0} views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-100 rounded-full">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"></div>
        </header>

        {/* Featured Image - Premium */}
        {blog.photo && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <div className="relative">
              <img
                src={blog.photo}
                alt={blog.name}
                className="w-full h-auto max-h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Blog Content - Premium Styling */}
        <article className="prose prose-lg prose-orange max-w-none mb-16">
          <div 
            className="text-gray-700 leading-relaxed blog-content"
            dangerouslySetInnerHTML={createMarkup(blog.description)}
          />
        </article>

        {/* Additional Content */}
        {blog.content && (
          <div className="mb-16">
            <div 
              className="prose prose-slate max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        )}

        {/* Engagement Section */}
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              liked 
                ? 'bg-red-50 text-red-600 border-2 border-red-200' 
                : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-red-200 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likesCount} Likes</span>
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 border-2 border-gray-200 rounded-xl font-medium hover:border-blue-200 hover:bg-blue-50 transition-all duration-300">
            <MessageCircle className="w-5 h-5" />
            <span>Comment</span>
          </button>
        </div>

        {/* Share Section - Premium */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">Share this article</h3>
                <p className="text-gray-500">Help others discover this insightful post</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Web Share API */}
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button
                    onClick={shareViaWebAPI}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-orange-200"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                )}
                
                {/* Social Media Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={shareOnFacebook}
                    className="p-2.5 bg-[#1877F2] hover:bg-[#0d65d9] text-white rounded-xl transition-all hover:scale-105 shadow-md"
                    title="Share on Facebook"
                  >
                    <FaFacebook className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={shareOnTwitter}
                    className="p-2.5 bg-[#000000] hover:bg-gray-800 text-white rounded-xl transition-all hover:scale-105 shadow-md"
                    title="Share on Twitter"
                  >
                    <BsTwitter className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={shareOnLinkedIn}
                    className="p-2.5 bg-[#0A66C2] hover:bg-[#0953a0] text-white rounded-xl transition-all hover:scale-105 shadow-md"
                    title="Share on LinkedIn"
                  >
                    <LiaLinkedin className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={copyToClipboard}
                    className={`p-2.5 ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-800'} text-white rounded-xl transition-all hover:scale-105 flex items-center gap-2 shadow-md`}
                    title="Copy link"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Link Box */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate font-mono">{shareUrl}</span>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 px-4 py-1.5 text-sm bg-white text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1 border border-gray-200 hover:border-orange-200"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Blogs - Premium */}
        {relatedBlogs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-300 rounded-full"></div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">Related Articles</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  href={`/blog/${relatedBlog.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full">
                    {relatedBlog.photo && (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={relatedBlog.photo}
                          alt={relatedBlog.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/10 group-hover:to-black/0 transition-all duration-500"></div>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(relatedBlog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                        {relatedBlog.name}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {getExcerpt(relatedBlog.description, 80)}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-orange-500 font-medium group-hover:gap-2 transition-all flex items-center gap-1">
                          Read More <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                        <span className="text-xs text-gray-400">{calculateReadTime(relatedBlog.description)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blogs Button - Premium */}
        <div className="text-center">
          <button
            onClick={() => router.push('/blog')}
            className="px-10 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl font-medium transition-all flex items-center gap-2 mx-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-5 h-5" />
            View All Blogs
          </button>
        </div>
      </main>

      {/* Newsletter Section - Premium */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Newsletter
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Stay Updated with Real Estate Insights
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Subscribe to our newsletter for the latest blog posts, market trends, and expert analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500 transition-all shadow-lg"
            />
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <BlogDetailContent />
    </Suspense>
  );
}