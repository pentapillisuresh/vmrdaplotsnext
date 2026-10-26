'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ApiService from '../hooks/ApiService';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Clock3,
  Search,
  TrendingUp,
} from 'lucide-react';

// True Orange
const ORANGE = '#FF6B00';

function stripHtml(html = '') {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const element = document.createElement('div');
  element.innerHTML = html;
  return (element.textContent || '').replace(/\s+/g, ' ').trim();
}

function getReadTime(html = '') {
  const count = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(count / 200))} min read`;
}

function getBlogUrl(blog) {
  return `/blog/${blog.slug || blog.id}`;
}

function ArticleImage({ blog, featured = false }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-stone-100 ${
        featured ? 'h-64 sm:h-80 lg:h-full lg:min-h-[420px]' : 'h-56'
      }`}
    >
      {blog.photo && !imageError ? (
        <img
          src={blog.photo}
          alt={blog.name || 'Real estate insights'}
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-stone-400">
          <Building2 size={44} strokeWidth={1.2} />
          <span className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]">
            VMRDA Plots
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </div>
  );
}

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadBlogs() {
      try {
        // ApiService interceptor returns data directly
        const data = await ApiService.get('/blogs');
        
        // Safely handle different response structures
        const blogList = Array.isArray(data) 
          ? data 
          : Array.isArray(data?.blogs) 
            ? data.blogs 
            : Array.isArray(data?.data?.blogs)
              ? data.data.blogs
              : [];

        if (active) {
          setBlogs(blogList);
          setFetchError(false);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        if (active) {
          setFetchError(true);
          setBlogs([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBlogs();

    return () => {
      active = false;
    };
  }, []);

  const visibleBlogs = useMemo(() => {
    const published = blogs.filter(
      (blog) => !blog.status || blog.status.toLowerCase() === 'published'
    );

    const query = search.trim().toLowerCase();
    if (!query) return published;

    return published.filter((blog) => {
      const title = (blog.name || '').toLowerCase();
      const description = stripHtml(blog.description || '').toLowerCase();
      return title.includes(query) || description.includes(query);
    });
  }, [blogs, search]);

  const featuredBlog = search.trim() ? null : visibleBlogs[0];
  const articleBlogs = featuredBlog ? visibleBlogs.slice(1) : visibleBlogs;

  return (
    <main className="min-h-screen bg-[#FCFBF8] text-stone-900">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#191916]">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/blogbanner.jpeg"
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25" />
        </div>

        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full" style={{ background: ORANGE }} />
              VMRDA Plots Journal
            </span>

            <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Insights for your
              <span className="block" style={{ color: ORANGE }}>
                next investment.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Discover property locations, plot-buying essentials, real-estate
              trends and practical guidance to help you make informed decisions.
            </p>

            <a
              href="#latest-articles"
              className="mt-9 inline-flex items-center gap-3 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-95"
              style={{ background: ORANGE }}
            >
              Explore articles <ArrowRight size={18} />
            </a>
          </div>
        </div>
        <div className="h-1" style={{ background: ORANGE }} />
      </section>

      {/* INTRODUCTION AND SEARCH */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-600">
              Knowledge meets opportunity
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              The realty journal
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              Expert perspectives on property locations, legal verification,
              land investment and choosing the right plot.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-stone-500">
            <BookOpen size={19} style={{ color: ORANGE }} />
            {visibleBlogs.length} articles
          </div>
        </div>

        <div className="mt-8 max-w-xl">
          <label htmlFor="blog-search" className="sr-only">
            Search real-estate articles
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5 shadow-sm transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
            <Search size={19} className="shrink-0 text-stone-400" />
            <input
              id="blog-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search locations, plots, investment..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
            />
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section
        id="latest-articles"
        className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-20 pt-5 sm:px-8 lg:px-10"
      >
        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <div className="h-56 bg-stone-200" />
                <div className="space-y-4 p-6">
                  <div className="h-3 w-24 rounded bg-stone-200" />
                  <div className="h-6 rounded bg-stone-200" />
                  <div className="h-4 rounded bg-stone-100" />
                  <div className="h-4 w-2/3 rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : fetchError ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto text-stone-400" size={38} />
            <h3 className="mt-4 text-xl font-semibold">Unable to load articles</h3>
            <p className="mt-2 text-sm text-stone-500">Please refresh the page or try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg px-5 py-3 text-sm font-semibold text-white"
              style={{ background: ORANGE }}
            >
              Try again
            </button>
          </div>
        ) : visibleBlogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center">
            <BookOpen className="mx-auto text-stone-400" size={38} />
            <h3 className="mt-4 text-xl font-semibold">
              {search ? 'No matching articles' : 'Articles coming soon'}
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              {search
                ? 'Try searching with another keyword.'
                : 'Check back soon for real-estate insights.'}
            </p>
          </div>
        ) : (
          <>
            {/* FEATURED ARTICLE */}
            {featuredBlog && (
              <div className="mb-12">
                <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  <TrendingUp size={16} style={{ color: ORANGE }} />
                  Featured article
                </p>

                <Link
                  href={getBlogUrl(featuredBlog)}
                  className="group grid overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:grid-cols-2"
                >
                  <ArticleImage blog={featuredBlog} featured />

                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="rounded-full bg-orange-50 px-3 py-1.5 font-semibold uppercase tracking-wider text-orange-800">
                        Featured
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock3 size={14} />
                        {getReadTime(featuredBlog.description)}
                      </span>
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-orange-600 sm:text-3xl">
                      {featuredBlog.name}
                    </h3>

                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-stone-600 sm:text-base">
                      {stripHtml(featuredBlog.description || 'Read this article for more real-estate insights.')}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 pt-5">
                      <span className="flex items-center gap-2 text-xs text-stone-500">
                        <CalendarDays size={15} />
                        {featuredBlog.createdAt
                          ? new Date(featuredBlog.createdAt).toLocaleDateString(
                              'en-IN',
                              { day: 'numeric', month: 'short', year: 'numeric' }
                            )
                          : 'Realty Insights'}
                      </span>

                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                        Read article
                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* ARTICLE GRID */}
            <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
              <h3 className="text-xl font-semibold">
                {search ? 'Search results' : 'Latest articles'}
              </h3>

              <span className="text-xs text-stone-500">
                {articleBlogs.length} articles
              </span>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {articleBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={getBlogUrl(blog)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                >
                  <ArticleImage blog={blog} />

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString(
                              'en-IN',
                              { day: 'numeric', month: 'short', year: 'numeric' }
                            )
                          : 'Recent article'}
                      </span>

                      <span className="flex shrink-0 items-center gap-1">
                        <Clock3 size={13} />
                        {getReadTime(blog.description)}
                      </span>
                    </div>

                    <h3 className="mt-5 line-clamp-2 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-orange-600">
                      {blog.name}
                    </h3>

                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-stone-600">
                      {stripHtml(blog.description || 'Read the full article for more information.')}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                      <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                        VMRDA Plots
                      </span>

                      <span className="flex items-center gap-2 text-sm font-semibold text-orange-600">
                        Read more
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Make informed decisions
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Your next property journey starts with knowledge.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
              Research locations, compare properties and verify documents
              before investing in land.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-95"
            style={{ background: ORANGE }}
          >
            Explore properties <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}