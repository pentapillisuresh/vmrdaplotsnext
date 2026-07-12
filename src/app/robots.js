export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],

    sitemap: "https://vmrdaplots.com/sitemap.xml",

    host: "https://vmrdaplots.com",
  };
}