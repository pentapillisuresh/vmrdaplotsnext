
export const openProperty = (property) => {
  if (!property?.slug) {
    console.error("Property slug is missing:", property);
    return;
  }

  const slug = encodeURIComponent(property.slug);
  const url = `/property/${slug}`;

  window.open(url, "_blank", "noopener,noreferrer");
};
