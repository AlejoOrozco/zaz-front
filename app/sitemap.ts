import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const HOME_IMAGES = [
  "/images/founder/alejandro.jpeg",
  "/images/what-we-build/animated-web-pages.webp",
  "/images/what-we-build/web-pages.webp",
  "/images/what-we-build/landing-pages.webp",
  "/images/what-we-build/shops.jpg",
  "/images/what-we-build/mobile-apps.jpg",
  "/images/what-we-build/personalized-software.webp",
  "/images/what-we-build/ai-agents.webp",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: HOME_IMAGES.map((path) => absoluteUrl(path)),
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
