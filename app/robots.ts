import type { MetadataRoute } from "next";

const BASE_URL = "https://www.uniquehub.pro";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private / non-SEO routes out of the index
      disallow: ["/admin", "/api", "/checkout", "/cart", "/profile", "/login"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
