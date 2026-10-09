
export const openArea = (area) => {
  if (!area?.name) {
    console.error("Area name is missing:", area);
    return;
  }

  const slug = area.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  window.open(
    `/area/${encodeURIComponent(slug)}`,
    "_blank",
    "noopener,noreferrer"
  );
};
