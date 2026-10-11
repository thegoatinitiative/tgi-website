import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const paths = [
  "/",
  "/mission",
  "/operations",
  "/operatives",
  "/media",
  "/intel",
  "/articles",
  "/donate",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }));
}
