import PropertyDetail from "@/pages/PropertyDetail";
import { notFound } from "next/navigation";

const SITE_URL = "https://vmrdaplots.com";
const API_URL = "https://service.vmrdaplots.com/api";

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

function getImages(photos) {
  if (!photos) return [];

  if (Array.isArray(photos)) {
    return photos;
  }

  if (typeof photos === "string") {
    try {
      const parsed = JSON.parse(photos);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      return [photos];
    } catch {
      return [photos];
    }
  }

  return [];
}

export async function generateMetadata({ params }) {
  const { title } = await params;

  const property = await getProperty(title);

  if (!property) {
    return {
      title: "Property Not Found | VMRDA Plots",

      description: "The requested property could not be found.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const images = getImages(property.photos);

  const propertyTitle =
    property.title || "Property for Sale in Visakhapatnam";

  const city =
    property.address?.city || "Visakhapatnam";

  const locality =
    property.address?.locality || "";

  const category =
    property.category?.name || "Property";

  const description =
    property.description?.substring(0, 160) ||
    `${propertyTitle} ${category} for sale in ${locality}, ${city}.`;

  const canonicalUrl =
    `${SITE_URL}/property/${property.slug || title}`;

  return {
    title: `${propertyTitle} | VMRDA Plots`,

    description,

    keywords: [
      propertyTitle,
      category,
      city,
      locality,
      "VMRDA Plots",
      "Plots for Sale",
      "Properties for Sale in Visakhapatnam",
      "Real Estate Visakhapatnam",
    ],

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
      },
    },

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: propertyTitle,

      description,

      url: canonicalUrl,

      siteName: "VMRDA Plots",

      type: "website",

      locale: "en_IN",

      images: images.map((img) => ({
        url: img,
        width: 1200,
        height: 800,
        alt: `${propertyTitle} - ${locality}, ${city}`,
      })),
    },

    twitter: {
      card: "summary_large_image",

      title: propertyTitle,

      description,

      images: images.length ? [images[0]] : [],
    },
  };
}

export default async function Page({ params }) {
  const { title } = await params;

  const property = await getProperty(title);

  if (!property) {
    notFound();
  }

  const images = getImages(property.photos);

  const canonicalUrl =
    `${SITE_URL}/property/${property.slug || title}`;

  const jsonLd = {
    "@context": "https://schema.org",

    "@type": "RealEstateListing",

    name: property.title,

    description: property.description,

    url: canonicalUrl,

    image: images,

    address: {
      "@type": "PostalAddress",

      addressLocality:
        property.address?.locality || undefined,

      addressRegion:
        property.address?.city || undefined,

      addressCountry: "IN",
    },

    ...(property.price
      ? {
          offers: {
            "@type": "Offer",

            price: property.price,

            priceCurrency: "INR",

            availability:
              "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <PropertyDetail
        title={title}
        initialProperty={property}
      />
    </>
  );
}