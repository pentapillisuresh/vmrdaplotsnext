export default async function sitemap() {
  const baseUrl = "https://vmrdaplots.com";
  const apiUrl = "https://service.vmrdaplots.com/api/properties";

  try {
    // =========================
    // 1. Fetch first page
    // =========================
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

    console.log("Sitemap API:", {
      count: firstData.count,
      totalPages: firstData.totalPages,
      currentPage: firstData.currentPage,
      properties: firstData.properties?.length,
    });

    // Your API returns "properties"
    let allProperties = firstData.properties || [];

    const totalPages = Number(firstData.totalPages) || 1;

    console.log("Total pages:", totalPages);
    console.log("Page 1 properties:", allProperties.length);

    // =========================
    // 2. Fetch remaining pages
    // =========================
    for (let page = 2; page <= totalPages; page++) {
      try {
        const response = await fetch(
          `${apiUrl}?page=${page}&limit=10`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          console.error(
            `Sitemap page ${page} failed: ${response.status}`
          );
          continue;
        }

        const pageData = await response.json();

        const properties = pageData.properties || [];

        console.log(
          `Sitemap page ${page}: ${properties.length} properties`
        );

        allProperties.push(...properties);
      } catch (pageError) {
        console.error(
          `Error fetching sitemap page ${page}:`,
          pageError
        );
      }
    }

    // =========================
    // 3. Remove duplicate slugs
    // =========================
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

    console.log(
      "Total properties fetched:",
      allProperties.length
    );

    console.log(
      "Unique properties:",
      uniqueProperties.length
    );

    // =========================
    // 4. Create property URLs
    // =========================
    const propertyUrls = uniqueProperties.map((property) => ({
      url: `${baseUrl}/property/${property.slug}`,
      lastModified: property.updatedAt
        ? new Date(property.updatedAt)
        : new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }));

    // =========================
    // 5. Static URLs
    // =========================
    const staticUrls = [
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
    ];

    // =========================
    // 6. Return sitemap
    // =========================
    return [
      ...staticUrls,
      ...propertyUrls,
    ];
  } catch (error) {
    console.error("Sitemap Error:", error);

    // Return static URLs if first API request fails
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
    ];
  }
}