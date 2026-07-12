export default async function sitemap() {
  const baseUrl = "https://vmrdaplots.com";

  try {
    const response = await fetch(
      "https://service.vmrdaplots.com/api/properties",
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    const allProperties = data.properties || [];

    // Remove duplicate slugs
    const uniqueProperties = [
      ...new Map(
        allProperties
          .filter((item) => item.slug && item.slug.trim() !== "")
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