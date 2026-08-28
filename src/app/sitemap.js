export default async function sitemap() {
  const baseUrl = "https://vmrdaplots.com";
  const apiUrl = "https://service.vmrdaplots.com/api/properties";

  try {
    // First request to know total pages
    const firstResponse = await fetch(
      `${apiUrl}?page=1&limit=10`,
      {
        cache: "no-store",
      }
    );

    if (!firstResponse.ok) {
      throw new Error(`API Error: ${firstResponse.status}`);
    }

    const firstData = await firstResponse.json();

    let allProperties = firstData.data || [];

    const totalPages = firstData.totalPages || 1;

    // Fetch remaining pages
    if (totalPages > 1) {
      const pageRequests = [];

      for (let page = 2; page <= totalPages; page++) {
        pageRequests.push(
          fetch(`${apiUrl}?page=${page}&limit=10`, {
            cache: "no-store",
          }).then((res) => {
            if (!res.ok) {
              throw new Error(`API Error on page ${page}: ${res.status}`);
            }

            return res.json();
          })
        );
      }

      const pageResponses = await Promise.all(pageRequests);

      for (const pageData of pageResponses) {
        allProperties.push(...(pageData.data || []));
      }
    }

    // Remove duplicate slugs
    const uniqueProperties = [
      ...new Map(
        allProperties
          .filter(
            (item) =>
              item.slug &&
              typeof item.slug === "string" &&
              item.slug.trim() !== ""
          )
          .map((item) => [item.slug, item])
      ).values(),
    ];

    const propertyUrls = uniqueProperties.map((property) => ({
      url: `${baseUrl}/property/${property.slug}`,
      lastModified: property.updatedAt
        ? new Date(property.updatedAt)
        : new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },

      {
        url: `${baseUrl}/properties-list`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },

      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },

      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },

      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },

      {
        url: `${baseUrl}/area`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },

      {
        url: `${baseUrl}/project`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },

      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.4,
      },

      {
        url: `${baseUrl}/terms-conditions`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.4,
      },

      ...propertyUrls,
    ];
  } catch (error) {
    console.error("Sitemap Error:", error);

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}