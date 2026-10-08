import PropertyDetail from "@/pages/PropertyDetail";
import { redirect } from "next/navigation";
import { cache } from "react";

const SITE_URL = "https://vmrdaplots.com";
const API_URL = "https://service.vmrdaplots.com/api";

/* ============================================================
   NORMALIZE SLUG
   ============================================================ */

function normalizeSlug(value) {
  if (!value) return "";

  let slug = String(value).trim();

  // Decode URL encoded values such as %2C
  try {
    slug = decodeURIComponent(slug);
  } catch {
    // Keep original value if decoding fails
  }

  // Remove leading/trailing spaces
  slug = slug.trim();

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, "-");

  // Remove accidental trailing commas
  slug = slug.replace(/,+$/g, "");

  // Remove accidental trailing punctuation
  slug = slug.replace(/[.,;:!?]+$/g, "");

  // Remove duplicate hyphens
  slug = slug.replace(/-+/g, "-");

  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");

  return slug;
}

/* ============================================================
   FETCH PROPERTY
   ============================================================ */

const getProperty = cache(async (slug) => {
  if (!slug) {
    return null;
  }

  try {
    const cleanSlug = normalizeSlug(slug);

    console.log("======================================");
    console.log("PROPERTY REQUEST");
    console.log("Original slug:", slug);
    console.log("Clean slug:", cleanSlug);
    console.log(
      "API URL:",
      `${API_URL}/properties/getBySlug/${encodeURIComponent(cleanSlug)}`
    );
    console.log("======================================");

    const res = await fetch(
      `${API_URL}/properties/getBySlug/${encodeURIComponent(cleanSlug)}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      console.error(
        `Property API failed for ${cleanSlug}: ${res.status}`
      );

      return null;
    }

    const data = await res.json();

    return data?.property || null;
  } catch (error) {
    console.error("Property fetch error:", error);

    return null;
  }
});

/* ============================================================
   GET PROPERTY IMAGES
   ============================================================ */

function getImages(photos) {
  if (!photos) {
    return [];
  }

  let images = [];

  /* ----------------------------------------------------------
     Array
  ---------------------------------------------------------- */

  if (Array.isArray(photos)) {
    images = photos;
  }

  /* ----------------------------------------------------------
     String
  ---------------------------------------------------------- */

  else if (typeof photos === "string") {
    const trimmed = photos.trim();

    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        images = parsed;
      } else {
        images = [trimmed];
      }
    } catch {
      images = [trimmed];
    }
  }

  return images
    .filter(
      (image) =>
        typeof image === "string" &&
        image.trim() !== ""
    )
    .map((image) => {
      let cleanUrl = image.trim();

      /* --------------------------------------------------------
         Convert HTTP to HTTPS
      -------------------------------------------------------- */

      if (/^http:\/\//i.test(cleanUrl)) {
        cleanUrl = cleanUrl.replace(
          /^http:\/\//i,
          "https://"
        );
      }

      /* --------------------------------------------------------
         Relative image URL
      -------------------------------------------------------- */

      if (cleanUrl.startsWith("/")) {
        return `${API_URL}${cleanUrl}`;
      }

      return cleanUrl;
    })
    .filter(Boolean);
}

/* ============================================================
   CLEAN TEXT
   ============================================================ */

function cleanText(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ============================================================
   GET PROPERTY TITLE
   ============================================================ */

function getPropertyTitle(property) {
  return (
    property?.title ||
    property?.propertyName ||
    property?.name ||
    "Property for Sale in Visakhapatnam"
  );
}

/* ============================================================
   GET CITY
   ============================================================ */

function getCity(property) {
  return (
    property?.address?.city ||
    property?.city ||
    property?.location?.city ||
    "Visakhapatnam"
  );
}

/* ============================================================
   GET LOCALITY
   ============================================================ */

function getLocality(property) {
  return (
    property?.address?.locality ||
    property?.locality ||
    property?.area ||
    property?.location?.locality ||
    ""
  );
}

/* ============================================================
   GET CATEGORY
   ============================================================ */

function getCategory(property) {
  return (
    property?.category?.name ||
    property?.categoryName ||
    property?.propertySubtype ||
    property?.propertyType ||
    "Property"
  );
}

/* ============================================================
   GET SEO KEYWORDS
   ============================================================ */

function getSeoKeywords(
  property,
  propertyTitle,
  city,
  locality,
  category
) {
  /* ----------------------------------------------------------
     Admin entered keywords
  ---------------------------------------------------------- */

  if (
    property?.metaKeywords &&
    typeof property.metaKeywords === "string"
  ) {
    const adminKeywords = property.metaKeywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    if (adminKeywords.length > 0) {
      return adminKeywords;
    }
  }

  /* ----------------------------------------------------------
     Automatic keywords
  ---------------------------------------------------------- */

  const keywords = [
    propertyTitle,

    `${propertyTitle} for sale`,

    `${category} in ${city}`,

    `${category} for sale in ${city}`,

    locality
      ? `${category} in ${locality}`
      : null,

    locality
      ? `${category} for sale in ${locality}`
      : null,

    locality
      ? `properties in ${locality}`
      : null,

    locality
      ? `property for sale in ${locality}`
      : null,

    `properties in ${city}`,

    `properties for sale in ${city}`,

    `plots for sale in ${city}`,

    `real estate in ${city}`,

    `land for sale in ${city}`,

    "VMRDA Plots",

    "VMRDA approved plots",

    "properties for sale in Visakhapatnam",

    "real estate Visakhapatnam",
  ];

  return [
    ...new Set(
      keywords.filter(Boolean)
    ),
  ];
}

/* ============================================================
   GET DESCRIPTION
   ============================================================ */

function getSeoDescription(
  property,
  propertyTitle,
  city,
  locality,
  category
) {
  /* ----------------------------------------------------------
     Admin meta description
  ---------------------------------------------------------- */

  const adminDescription = cleanText(
    property?.metaDescription
  );

  if (adminDescription) {
    return adminDescription;
  }

  /* ----------------------------------------------------------
     Property description
  ---------------------------------------------------------- */

  const propertyDescription = cleanText(
    property?.description
  );

  if (propertyDescription) {
    return propertyDescription.slice(0, 300);
  }

  /* ----------------------------------------------------------
     Automatic description
  ---------------------------------------------------------- */

  return cleanText(
    `Explore ${propertyTitle}, a ${category} for sale in ${
      locality ? `${locality}, ` : ""
    }${city}. View property price, location, images, amenities, property details and contact information on VMRDA Plots.`
  );
}

/* ============================================================
   DYNAMIC SEO METADATA
   ============================================================ */

export async function generateMetadata({ params }) {
  const { title } = await params;

  const property = await getProperty(title);

  /* ==========================================================
     PROPERTY NOT FOUND
  ========================================================== */

  if (!property) {
    return {
      title: "Property Not Found | VMRDA Plots",

      description:
        "The requested property could not be found on VMRDA Plots.",

      robots: {
        index: false,
        follow: false,
      },

      alternates: {
        canonical: SITE_URL,
      },
    };
  }

  /* ==========================================================
     PROPERTY DATA
  ========================================================== */

  const images = getImages(property.photos);

  const propertyTitle =
    getPropertyTitle(property);

  const city =
    getCity(property);

  const locality =
    getLocality(property);

  const category =
    getCategory(property);

  /* ==========================================================
     DESCRIPTION
  ========================================================== */

  const seoDescription =
    getSeoDescription(
      property,
      propertyTitle,
      city,
      locality,
      category
    );

  /* ==========================================================
     SEO TITLE
  ========================================================== */

  const seoTitle =
    cleanText(property.metaTitle) ||
    `${propertyTitle} for Sale in ${
      locality || city
    } | VMRDA Plots`;

  /* ==========================================================
     KEYWORDS
  ========================================================== */

  const seoKeywords =
    getSeoKeywords(
      property,
      propertyTitle,
      city,
      locality,
      category
    );

  /* ==========================================================
     DATABASE SLUG
  ========================================================== */

  const actualSlug =
    normalizeSlug(
      property.slug || title
    );

  /* ==========================================================
     CANONICAL URL
  ========================================================== */

  const canonicalUrl =
    `${SITE_URL}/property/${encodeURIComponent(actualSlug)}`;

  /* ==========================================================
     MAIN IMAGE
  ========================================================== */

  const mainImage =
    images.length > 0
      ? images[0]
      : undefined;

  /* ==========================================================
     IMAGE METADATA
  ========================================================== */

  const openGraphImages =
    images.length > 0
      ? images.map((image) => ({
          url: image,
          width: 1200,
          height: 800,

          alt: `${propertyTitle}${
            locality
              ? ` - ${locality}`
              : ""
          }${
            city
              ? `, ${city}`
              : ""
          }`,
        }))
      : [];

  /* ==========================================================
     RETURN METADATA
  ========================================================== */

  return {
    metadataBase: new URL(SITE_URL),

    title: seoTitle,

    description: seoDescription,

    keywords: seoKeywords,

    applicationName: "VMRDA Plots",

    authors: [
      {
        name: "VMRDA Plots",
        url: SITE_URL,
      },
    ],

    creator: "VMRDA Plots",

    publisher: "VMRDA Plots",

    alternates: {
      canonical: canonicalUrl,
    },

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

    openGraph: {
      title: seoTitle,

      description: seoDescription,

      url: canonicalUrl,

      siteName: "VMRDA Plots",

      type: "website",

      locale: "en_IN",

      ...(openGraphImages.length > 0
        ? {
            images: openGraphImages,
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",

      title: seoTitle,

      description: seoDescription,

      ...(mainImage
        ? {
            images: [mainImage],
          }
        : {}),
    },

    icons: {
      icon: "/favicon.ico",
    },
  };
}

/* ============================================================
   PROPERTY PAGE
   ============================================================ */

export default async function Page({ params }) {
  const { title } = await params;

  /* ==========================================================
     NORMALIZE INCOMING SLUG
  ========================================================== */

  const incomingSlug = normalizeSlug(title);

  /* ==========================================================
     FETCH PROPERTY
  ========================================================== */

  const property =
    await getProperty(incomingSlug);

  /* ==========================================================
     PROPERTY NOT FOUND
  ========================================================== */

  if (!property) {
    redirect("/");
  }

  /* ==========================================================
     PROPERTY DATABASE SLUG
  ========================================================== */

  const propertySlug =
    normalizeSlug(
      property.slug || incomingSlug
    );

  /* ==========================================================
     REDIRECT WRONG URL TO DATABASE SLUG
  ========================================================== */

  if (
    property.slug &&
    normalizeSlug(title) !==
      normalizeSlug(property.slug)
  ) {
    redirect(
      `/property/${encodeURIComponent(propertySlug)}`
    );
  }

  /* ==========================================================
     PROPERTY IMAGES
  ========================================================== */

  const images =
    getImages(property.photos);

  /* ==========================================================
     PROPERTY INFORMATION
  ========================================================== */

  const propertyTitle =
    getPropertyTitle(property);

  const city =
    getCity(property);

  const locality =
    getLocality(property);

  const category =
    getCategory(property);

  /* ==========================================================
     DESCRIPTION
  ========================================================== */

  const description =
    cleanText(property.description) ||
    `${propertyTitle} ${category} for sale in ${
      locality
        ? `${locality}, `
        : ""
    }${city}.`;

  /* ==========================================================
     CANONICAL URL
  ========================================================== */

  const canonicalUrl =
    `${SITE_URL}/property/${encodeURIComponent(
      propertySlug
    )}`;

  /* ==========================================================
     PRICE
  ========================================================== */

  const numericPrice =
    property.price !== undefined &&
    property.price !== null &&
    property.price !== "" &&
    !Number.isNaN(Number(property.price))
      ? Number(property.price)
      : null;

  /* ==========================================================
     PROPERTY IMAGES FOR JSON-LD
  ========================================================== */

  const structuredImages =
    images.length > 0
      ? images
      : [
          `${SITE_URL}/og-image.jpg`,
        ];

  /* ==========================================================
     AVAILABILITY
  ========================================================== */

  const propertyStatus =
    String(
      property.status ||
      property.propertyStatus ||
      property.saleStatus ||
      ""
    ).toLowerCase();

  const isSold =
    propertyStatus === "sold" ||
    propertyStatus === "sold out" ||
    propertyStatus === "soldout";

  /* ==========================================================
     JSON-LD
  ========================================================== */

  const jsonLd = {
    "@context": "https://schema.org",

    "@type": "RealEstateListing",

    "@id": canonicalUrl,

    name: propertyTitle,

    description,

    url: canonicalUrl,

    image: structuredImages,

    inLanguage: "en-IN",

    mainEntityOfPage: {
      "@type": "WebPage",

      "@id": canonicalUrl,

      url: canonicalUrl,

      name: propertyTitle,
    },

    about: {
      "@type": "Place",

      name: propertyTitle,

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
    },

    ...(category
      ? {
          additionalType: category,
        }
      : {}),

    ...(numericPrice !== null
      ? {
          offers: {
            "@type": "Offer",

            url: canonicalUrl,

            price: numericPrice,

            priceCurrency: "INR",

            availability: isSold
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",

            itemCondition:
              "https://schema.org/NewCondition",
          },
        }
      : {}),

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

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <>
      {/* ======================================================
          JSON-LD STRUCTURED DATA
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* ======================================================
          PROPERTY PAGE
      ====================================================== */}

      <PropertyDetail
        title={propertySlug}
        initialProperty={property}
      />
    </>
  );
}