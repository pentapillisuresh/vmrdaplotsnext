import PropertyDetail from "@/pages/PropertyDetail";
import { notFound } from "next/navigation";

const SITE_URL = "https://vmrdaplots.com";
// const API_URL = "https://service.vmrdaplots.com/api";
const API_URL = "http://localhost:3001/api";

/**
 * Fetch property by slug
 */
async function getProperty(title) {
  try {
    const res = await fetch(
      `${API_URL}/properties/getBySlug/${encodeURIComponent(title)}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data?.property || null;
  } catch (error) {
    console.error("Property fetch error:", error);
    return null;
  }
}

/**
 * Get property images
 * Supports:
 * - Array
 * - JSON string
 * - Single URL
 *
 * Also converts HTTP → HTTPS.
 */
function getImages(photos) {
  if (!photos) return [];

  let images = [];

  if (Array.isArray(photos)) {
    images = photos;
  } else if (typeof photos === "string") {
    try {
      const parsed = JSON.parse(photos);

      if (Array.isArray(parsed)) {
        images = parsed;
      } else {
        images = [photos];
      }
    } catch {
      images = [photos];
    }
  }

  return images
    .filter(
      (img) =>
        typeof img === "string" &&
        img.trim() !== ""
    )
    .map((img) => {
      const cleanUrl = img.trim();

      // Convert HTTP image URL to HTTPS
      if (cleanUrl.startsWith("http://")) {
        return cleanUrl.replace(
          /^http:\/\//i,
          "https://"
        );
      }

      // Handle relative image paths
      if (cleanUrl.startsWith("/")) {
        return `${API_URL}${cleanUrl}`;
      }

      return cleanUrl;
    });
}

/**
 * Dynamic SEO Metadata
 */
export async function generateMetadata({ params }) {
  const { title } = await params;

  const property = await getProperty(title);

  /**
   * Property not found
   */
  if (!property) {
    return {
      title: "Property Not Found | VMRDA Plots",

      description:
        "The requested property could not be found on VMRDA Plots.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const images = getImages(property.photos);

  const propertyTitle =
    property.title ||
    property.propertyName ||
    "Property for Sale in Visakhapatnam";

  const city =
    property.address?.city ||
    "Visakhapatnam";

  const locality =
    property.address?.locality ||
    "";

  const category =
    property.category?.name ||
    "Property";

  /**
   * Clean SEO description
   */
  const description =
    property.description
      ?.replace(/\s+/g, " ")
      .trim()
      .substring(0, 160) ||
    `${propertyTitle} ${category} for sale in ${
      locality ? `${locality}, ` : ""
    }${city}.`;

  /**
   * Canonical URL
   */
  const canonicalUrl =
    `${SITE_URL}/property/${property.slug || title}`;

  /**
   * Main image
   */
  const mainImage =
    images.length > 0
      ? images[0]
      : undefined;

  return {
    /**
     * SEO Title
     */
    title: `${propertyTitle} | VMRDA Plots`,

    /**
     * SEO Description
     */
    description,

    /**
     * Keywords
     */
    keywords: [
      propertyTitle,
      category,
      locality,
      city,
      "VMRDA Plots",
      "VMRDA approved plots",
      "Plots for Sale",
      "Plots for Sale in Visakhapatnam",
      "Properties for Sale in Visakhapatnam",
      "Real Estate Visakhapatnam",
    ].filter(Boolean),

    /**
     * Robots
     */
    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },

    /**
     * Canonical URL
     */
    alternates: {
      canonical: canonicalUrl,
    },

    /**
     * Open Graph
     */
    openGraph: {
      title: propertyTitle,

      description,

      url: canonicalUrl,

      siteName: "VMRDA Plots",

      type: "website",

      locale: "en_IN",

      /**
       * All property images
       */
      images: images.map((image) => ({
        url: image,

        width: 1200,

        height: 800,

        alt: `${propertyTitle} - ${
          locality ? `${locality}, ` : ""
        }${city}`,
      })),
    },

    /**
     * Twitter / X
     */
    twitter: {
      card: "summary_large_image",

      title: propertyTitle,

      description,

      images: mainImage
        ? [mainImage]
        : [],
    },
  };
}

/**
 * Property Page
 */
export default async function Page({ params }) {
  const { title } = await params;

  /**
   * Fetch property
   */
  const property = await getProperty(title);

  /**
   * Property not found
   */
  if (!property) {
    notFound();
  }

  /**
   * Property images
   */
  const images = getImages(property.photos);

  /**
   * Property information
   */
  const propertyTitle =
    property.title ||
    property.propertyName ||
    "Property for Sale in Visakhapatnam";

  const city =
    property.address?.city ||
    "Visakhapatnam";

  const locality =
    property.address?.locality ||
    "";

  const category =
    property.category?.name ||
    "Property";

  const description =
    property.description ||
    `${propertyTitle} ${category} for sale in ${
      locality ? `${locality}, ` : ""
    }${city}.`;

  /**
   * Canonical URL
   */
  const canonicalUrl =
    `${SITE_URL}/property/${property.slug || title}`;

  /**
   * JSON-LD Structured Data
   */
  const jsonLd = {
    "@context": "https://schema.org",

    "@type": "RealEstateListing",

    name: propertyTitle,

    description: description
      .replace(/\s+/g, " ")
      .trim(),

    url: canonicalUrl,

    /**
     * Property images
     */
    image: images,

    /**
     * Main webpage
     */
    mainEntityOfPage: {
      "@type": "WebPage",

      "@id": canonicalUrl,
    },

    /**
     * Property type
     */
    additionalType: category,

    /**
     * Address
     */
    address: {
      "@type": "PostalAddress",

      ...(locality
        ? {
            addressLocality: locality,
          }
        : {}),

      ...(city
        ? {
            addressRegion: city,
          }
        : {}),

      addressCountry: "IN",
    },

    /**
     * Price information
     */
    ...(property.price
      ? {
          offers: {
            "@type": "Offer",

            price: Number(property.price),

            priceCurrency: "INR",

            availability:
              "https://schema.org/InStock",

            url: canonicalUrl,
          },
        }
      : {}),

    /**
     * Property owner / agent
     */
    ...(property.client
      ? {
          seller: {
            "@type": "RealEstateAgent",

            name:
              property.client.companyName ||
              property.client.fullName ||
              "VMRDA Plots",
          },
        }
      : {}),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Property Page */}
      <PropertyDetail
        title={title}
        initialProperty={property}
      />
    </>
  );
}