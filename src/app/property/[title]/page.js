import PropertyDetail from "@/pages/PropertyDetail";

export async function generateMetadata({ params }) {
  const { title } = await params;

  try {
    const res = await fetch(
      `https://service.vmrdaplots.com/api/properties/getBySlug/${title}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return {
        title: "VMRDA Plots",
      };
    }

    const data = await res.json();
    const property = data.property;

    let images = [];
    try {
      images = property.photos ? JSON.parse(property.photos) : [];
    } catch {
      images = [];
    }

    return {
      title: `${property.title} | VMRDA Plots`,
      description:
        property.description?.substring(0, 160) ||
        "Premium properties in Visakhapatnam.",

      keywords: [
        property.title,
        property.address.city,
        property.address.locality,
        property.category.name,
        "VMRDA Plots",
        "Plots for Sale",
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

      openGraph: {
        title: property.title,
        description: property.description,
        url: `https://vmrdaplots.com/property/${property.slug}`,
        siteName: "VMRDA Plots",
        images: images.map((img) => ({
          url: img,
          width: 1200,
          height: 630,
        })),
        locale: "en_IN",
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: property.title,
        description: property.description,
        images: images.length ? [images[0]] : [],
      },

      alternates: {
        canonical: `https://vmrdaplots.com/property/${property.slug}`,
      },
    };
  } catch (err) {
    return {
      title: "VMRDA Plots",
    };
  }
}

export default async function Page({ params }) {
  const { title } = await params;

  const res = await fetch(
    `https://service.vmrdaplots.com/api/properties/getBySlug/${title}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  const property = data.property;

  let images = [];

  try {
    images = property.photos ? JSON.parse(property.photos) : [];
  } catch {
    images = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `https://vmrdaplots.com/property/${property.slug}`,
    image: images,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.address?.locality,
      addressRegion: property.address?.city,
      addressCountry: "India",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <PropertyDetail title={title} />
    </>
  );
}