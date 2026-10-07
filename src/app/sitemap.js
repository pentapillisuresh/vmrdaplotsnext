const BASE_URL = "https://vmrdaplots.com";

const API_URL =
  "https://service.vmrdaplots.com/api/properties";

// ============================================================
// NEXT.JS SITEMAP CONFIG
// ============================================================

export const revalidate = 3600;

// ============================================================
// FETCH API PAGE
// ============================================================

async function fetchPropertyPage(page, limit = 100) {
  try {
    const response = await fetch(
      `${API_URL}?page=${page}&limit=${limit}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Sitemap API error - page ${page}: ${response.status}`
      );

      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      `Sitemap fetch error - page ${page}:`,
      error
    );

    return null;
  }
}

// ============================================================
// GET ALL PROPERTIES
// ============================================================

async function getAllProperties() {
  const limit = 100;

  // ==========================================================
  // FIRST PAGE
  // ==========================================================

  const firstData = await fetchPropertyPage(1, limit);

  if (!firstData) {
    return [];
  }

  let allProperties = Array.isArray(firstData.properties)
    ? firstData.properties
    : [];

  // ==========================================================
  // TOTAL PAGES
  // ==========================================================

  const totalPages =
    Number(firstData.totalPages) || 1;

  console.log(
    `Sitemap: Total API pages = ${totalPages}`
  );

  // ==========================================================
  // REMAINING PAGES
  // ==========================================================

  if (totalPages > 1) {
    for (
      let page = 2;
      page <= totalPages;
      page++
    ) {
      const pageData = await fetchPropertyPage(
        page,
        limit
      );

      if (!pageData) {
        continue;
      }

      const properties = Array.isArray(
        pageData.properties
      )
        ? pageData.properties
        : [];

      allProperties.push(...properties);

      console.log(
        `Sitemap: Page ${page} = ${properties.length} properties`
      );
    }
  }

  // ==========================================================
  // REMOVE INVALID SLUGS + DUPLICATE PROPERTIES
  // ==========================================================

  const uniqueProperties = [
    ...new Map(
      allProperties
        .filter(
          (property) =>
            property &&
            typeof property.slug === "string" &&
            property.slug.trim() !== ""
        )
        .map((property) => [
          property.slug.trim(),
          property,
        ])
    ).values(),
  ];

  console.log(
    `Sitemap: ${allProperties.length} total records`
  );

  console.log(
    `Sitemap: ${uniqueProperties.length} unique properties`
  );

  return uniqueProperties;
}

// ============================================================
// SAFE DATE
// ============================================================

function getLastModified(value) {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date();
  }

  return date;
}

// ============================================================
// STATIC URLS
// ============================================================

function getStaticUrls() {
  const now = new Date();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },

    {
      url: `${BASE_URL}/properties-list`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/area`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/project`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },

    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}

// ============================================================
// SITEMAP
// ============================================================

export default async function sitemap() {
  try {
    // ========================================================
    // STATIC PAGES
    // ========================================================

    const staticUrls = getStaticUrls();

    // ========================================================
    // PROPERTY DATA
    // ========================================================

    const properties = await getAllProperties();

    // ========================================================
    // PROPERTY URLS
    // ========================================================

    const propertyUrls = properties
      .filter(
        (property) =>
          property &&
          typeof property.slug === "string" &&
          property.slug.trim() !== ""
      )
      .map((property) => {
        const slug = property.slug.trim();

        return {
          url: `${BASE_URL}/property/${encodeURIComponent(slug)}`,

          lastModified: getLastModified(
            property.updatedAt
          ),

          changeFrequency: "daily",

          priority: 0.9,
        };
      });

    // ========================================================
    // COMBINE STATIC + PROPERTY URLS
    // ========================================================

    const allUrls = [
      ...staticUrls,
      ...propertyUrls,
    ];

    // ========================================================
    // REMOVE DUPLICATE URLS
    // ========================================================

    const uniqueUrls = [
      ...new Map(
        allUrls.map((item) => [
          item.url,
          item,
        ])
      ).values(),
    ];

    console.log(
      `Sitemap: Final URL count = ${uniqueUrls.length}`
    );

    // ========================================================
    // RETURN SITEMAP
    // ========================================================

    return uniqueUrls;
  } catch (error) {
    console.error(
      "Sitemap generation error:",
      error
    );

    // ========================================================
    // FALLBACK
    // ========================================================

    return getStaticUrls();
  }
}