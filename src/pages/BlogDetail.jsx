
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import ApiService from '../hooks/ApiService';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  Link2,
  Share2,
} from 'lucide-react';

const ORANGE = '#FF6B00';

function stripHtml(html = '') {
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const element = document.createElement('div');
  element.innerHTML = html;

  return (element.textContent || '').replace(/\s+/g, ' ').trim();
}

function getReadTime(html = '') {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function getBlogUrl(blog) {
  return `/blog/${blog.slug || blog.id}`;
}

/* FULL IMAGE: no cropping, no overlay, natural image ratio */
function FeaturedImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center bg-stone-100 sm:min-h-[300px]">
        <div className="text-center text-stone-400">
          <Building2
            size={42}
            strokeWidth={1.2}
            className="mx-auto"
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]">
            VMRDA Plots
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center overflow-hidden bg-[#F3F1ED]">
      <img
        src={src}
        alt={alt || 'Real estate article'}
        onError={() => setFailed(true)}
        className="block h-auto max-h-[520px] w-full object-contain"
      />
    </div>
  );
}

export default function BlogDetail({ id }) {
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  /* ORIGINAL API, FALLBACK AND SLUG LOGIC PRESERVED */
  useEffect(() => {
    if (!id) return;

    let active = true;

    async function loadBlog() {
      setLoading(true);
      setError('');

      try {
        let currentBlog = null;
        let fetchErrorStatus = null;

        try {
          currentBlog = await ApiService.get(
            `/blogs/${encodeURIComponent(id)}`
          );

          if (currentBlog?.error || !currentBlog) {
            throw new Error('Direct fetch failed');
          }
        } catch (directErr) {
          console.error('Direct blog request failed:', directErr);
  console.error('Status:', directErr?.response?.status);
  console.error('Response:', directErr?.response?.data);
  console.error('Message:', directErr?.message);
          console.warn(
            'Direct fetch failed. Trying fallback list API.',
            directErr?.response?.data || directErr?.message
          );

          fetchErrorStatus =
            directErr?.response?.status ||
            directErr?.status ||
            directErr?.data?.status;

          const allBlogsResponse = await ApiService.get('/blogs');

          const blogArray = Array.isArray(allBlogsResponse)
            ? allBlogsResponse
            : Array.isArray(allBlogsResponse?.blogs)
              ? allBlogsResponse.blogs
              : Array.isArray(allBlogsResponse?.data?.blogs)
                ? allBlogsResponse.data.blogs
                : [];

          currentBlog = blogArray.find(
            (item) =>
              item.slug === id || String(item.id) === String(id)
          );

          if (!currentBlog) {
            const customError = new Error(
              'Blog not found in list fallback'
            );
            customError.status = fetchErrorStatus || 404;
            throw customError;
          }
        }

        if (!active) return;

        setBlog(currentBlog);

        // Redirect UUID URL to the existing article slug.
        if (currentBlog.slug && id !== currentBlog.slug) {
          router.replace(getBlogUrl(currentBlog));
          return;
        }

        setShareUrl(
          `${window.location.origin}${getBlogUrl(currentBlog)}`
        );

        // ORIGINAL RELATED BLOG FETCH LOGIC
        try {
          const listData = await ApiService.get('/blogs');

          const allBlogs = Array.isArray(listData)
            ? listData
            : Array.isArray(listData?.blogs)
              ? listData.blogs
              : Array.isArray(listData?.data?.blogs)
                ? listData.data.blogs
                : [];

          if (!active) return;

          setRelatedBlogs(
            allBlogs
              .filter((item) => item.id !== currentBlog.id)
              .filter(
                (item) =>
                  !item.status ||
                  item.status.toLowerCase() === 'published'
              )
              .slice(0, 3)
          );
        } catch (relatedError) {
          console.warn(
            'Related articles could not be loaded:',
            relatedError?.response?.data || relatedError?.message
          );

          if (active) setRelatedBlogs([]);
        }
      } catch (fetchError) {
        console.error('Final Blog detail API error:', {
          message: fetchError?.message,
          status:
            fetchError?.response?.status || fetchError?.status,
          response: fetchError?.response?.data,
        });

        if (active) {
          const status =
            fetchError?.response?.status ||
            fetchError?.status ||
            fetchError?.data?.status ||
            404;

          if (status === 404) {
            setError('This article was not found.');
          } else if (status === 401 || status === 403) {
            setError(
              'You are not authorized to view this article.'
            );
          } else {
            setError(
              'Unable to load this article. Check your connection or try again later.'
            );
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBlog();

    return () => {
      active = false;
    };
  }, [id, router]);

  /* ORIGINAL SHARING FUNCTIONS PRESERVED */
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (copyError) {
      console.error('Could not copy link:', copyError);
    }
  }

  function shareOnFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  function shareOnLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  function shareOnWhatsApp() {
    const message = `${blog?.name || 'Real estate article'} ${shareUrl}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  async function shareArticle() {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.name,
          text: stripHtml(blog.description || '').slice(0, 150),
          url: shareUrl,
        });
      } catch (shareError) {
        if (shareError.name !== 'AbortError') {
          console.error('Share failed:', shareError);
        }
      }
    } else {
      await copyLink();
    }
  }

  /* LOADING */
  if (loading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#FCFBF8]">
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-stone-200"
            style={{ borderTopColor: ORANGE }}
          />
          <p className="mt-4 text-sm text-stone-500">
            Loading article...
          </p>
        </div>
      </main>
    );
  }

  /* ERROR */
  if (error || !blog) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#FCFBF8] px-5">
        <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <BookOpen
            size={38}
            className="mx-auto text-stone-400"
          />

          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Article unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-500">
            {error || 'This article is not available.'}
          </p>

          <button
            onClick={() => router.push('/blog')}
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
            style={{ background: ORANGE }}
          >
            <ArrowLeft size={16} />
            Back to articles
          </button>
        </div>
      </main>
    );
  }

  const safeDescription =
    typeof window !== 'undefined'
      ? DOMPurify.sanitize(blog.description || '', {
          USE_PROFILES: { html: true },
        })
      : blog.description || '';

  const safeContent =
    typeof window !== 'undefined'
      ? DOMPurify.sanitize(blog.content || '', {
          USE_PROFILES: { html: true },
        })
      : blog.content || '';

  const fullText = `${blog.description || ''} ${blog.content || ''}`;

  const publishedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <main className="min-h-screen bg-[#FCFBF8] text-stone-900">
      {/* TOP NAVIGATION */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-orange-700"
          >
            <ArrowLeft size={16} />
            All articles
          </Link>

          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-[0.16em] sm:text-sm"
          >
            VMRDA <span style={{ color: ORANGE }}>PLOTS</span>
          </Link>
        </div>
      </div>

      {/* BREADCRUMBS AND COMPACT HEADING */}
      <header className="mx-auto max-w-6xl px-4 pb-6 pt-7 sm:px-6 sm:pb-8 sm:pt-9 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-stone-500"
        >
          <Link href="/" className="transition hover:text-orange-700">
            Home
          </Link>

          <ChevronRight size={13} />

          <Link
            href="/blog"
            className="transition hover:text-orange-700"
          >
            Blog
          </Link>

          <ChevronRight size={13} />

          <span className="max-w-[220px] truncate text-stone-700">
            {blog.name}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
            style={{ background: ORANGE }}
          >
            Realty Insights
          </span>

          {blog.category?.name && (
            <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600">
              {blog.category.name}
            </span>
          )}
        </div>

        <h1 className="mt-4 max-w-4xl text-2xl font-semibold leading-snug tracking-tight sm:text-3xl lg:text-[34px]">
          {blog.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-500 sm:text-sm">
          {publishedDate && (
            <span className="flex items-center gap-2">
              <CalendarDays size={15} style={{ color: ORANGE }} />
              {publishedDate}
            </span>
          )}

          <span className="flex items-center gap-2">
            <Clock3 size={15} style={{ color: ORANGE }} />
            {getReadTime(fullText)}
          </span>

          {typeof blog.views !== 'undefined' && (
            <span className="flex items-center gap-2">
              <Eye size={15} style={{ color: ORANGE }} />
              {blog.views || 0} views
            </span>
          )}
        </div>
      </header>

      {/* FULL IMAGE - NATURAL ASPECT RATIO, NO CROPPING */}
      {blog.photo && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-[#F3F1ED] shadow-sm">
            <FeaturedImage src={blog.photo} alt={blog.name} />
          </div>
        </section>
      )}

      {/* ARTICLE CONTENT AND SIDEBAR */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-9 sm:px-6 sm:py-11 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-10 lg:px-8">
        <article className="min-w-0">
          <div className="rounded-xl border border-stone-200/80 bg-white p-5 sm:p-7 lg:p-8">
            {safeDescription && (
              <div
                className="blog-content prose prose-base max-w-none break-words text-[15px] leading-7 text-stone-600 prose-headings:mb-3 prose-headings:mt-6 prose-headings:text-lg prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-stone-900 prose-p:my-4 prose-p:leading-7 prose-a:text-orange-700 prose-strong:text-stone-900 prose-blockquote:border-orange-400 prose-li:marker:text-orange-600 prose-img:mx-auto prose-img:h-auto prose-img:max-w-full prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: safeDescription }}
              />
            )}

            {safeContent && safeContent !== safeDescription && (
              <div
                className="blog-content prose prose-base mt-6 max-w-none break-words text-[15px] leading-7 text-stone-600 prose-headings:mb-3 prose-headings:mt-6 prose-headings:text-lg prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-stone-900 prose-p:my-4 prose-p:leading-7 prose-a:text-orange-700 prose-strong:text-stone-900 prose-li:marker:text-orange-600 prose-img:mx-auto prose-img:h-auto prose-img:max-w-full prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />
            )}
          </div>

          {/* SHARE SECTION */}
          <div className="mt-7 rounded-xl border border-stone-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-base font-semibold">
                  Found this useful?
                </h2>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Share this article with someone planning their next investment.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={shareArticle}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                  style={{ background: ORANGE }}
                >
                  <Share2 size={15} />
                  Share
                </button>

                <button
                  onClick={shareOnWhatsApp}
                  className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  WhatsApp
                </button>

                <button
                  onClick={shareOnFacebook}
                  className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Facebook
                </button>

                <button
                  onClick={shareOnLinkedIn}
                  className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  LinkedIn
                </button>

                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2.5 text-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  {copied ? (
                    <Check size={15} className="text-green-600" />
                  ) : (
                    <Copy size={15} />
                  )}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>
            </div>

            <div className="mt-4 flex min-w-0 items-center gap-3 rounded-lg bg-stone-50 px-3 py-3">
              <Link2
                size={15}
                className="shrink-0 text-stone-400"
              />

              <span className="min-w-0 flex-1 truncate text-xs text-stone-500">
                {shareUrl}
              </span>

              <button
                onClick={copyLink}
                className="shrink-0 text-xs font-semibold text-orange-700 hover:text-orange-800"
              >
                Copy
              </button>
            </div>
          </div>
        </article>

        {/* COMPACT SIDEBAR */}
        <aside className="space-y-5">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <div
              className="mb-4 h-1 w-10 rounded-full"
              style={{ background: ORANGE }}
            />

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
              VMRDA Plots
            </p>

            <h2 className="mt-3 text-lg font-semibold leading-snug">
              Find your next property with confidence.
            </h2>

            <p className="mt-3 text-sm leading-6 text-stone-500">
              Explore properties and compare locations before making a decision.
            </p>

            <Link
              href="/properties"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 transition hover:text-orange-800"
            >
              Explore properties <ArrowRight size={15} />
            </Link>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="text-base font-semibold">
              Article details
            </h2>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-stone-500">Reading time</span>
                <span className="text-right font-medium">
                  {getReadTime(fullText)}
                </span>
              </div>

              {publishedDate && (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-stone-500">Published</span>
                  <span className="text-right font-medium">
                    {publishedDate}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <span className="text-stone-500">Topic</span>
                <span className="text-right font-medium">
                  {blog.category?.name || 'Real Estate'}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* RELATED ARTICLES */}
      {relatedBlogs.length > 0 && (
        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700">
                  Keep exploring
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                  More realty insights
                </h2>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
              >
                View all articles <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((item) => (
                <Link
                  key={item.id}
                  href={getBlogUrl(item)}
                  className="group overflow-hidden rounded-xl border border-stone-200 bg-[#FCFBF8] transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                >
                  {/* Show the entire related image too */}
                  {item.photo ? (
                    <div className="flex min-h-[150px] items-center justify-center overflow-hidden bg-[#F3F1ED]">
                      <img
                        src={item.photo}
                        alt={item.name || 'Related article'}
                        loading="lazy"
                        className="block h-auto max-h-56 w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-stone-100 text-stone-400">
                      <Building2 size={32} />
                    </div>
                  )}

                  <div className="p-5">
                    <p className="text-xs text-stone-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                        : 'Realty Insights'}
                    </p>

                    <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-orange-700">
                      {item.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
                      {stripHtml(item.description || '')}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
                      Read article
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM CTA */}
      <section className="bg-[#191916]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: ORANGE }}
            >
              VMRDA Plots Journal
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              Discover more property insights.
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-400">
              Continue exploring our real-estate articles and property listings.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 md:self-center"
            style={{ background: ORANGE }}
          >
            Browse articles <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
