import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      { source: "/luxury/", destination: "/luxury/index.html" },
      { source: "/automotive/", destination: "/automotive/index.html" },
      { source: "/gold-traders/", destination: "/gold-traders/index.html" },
      { source: "/watch-dealers/", destination: "/watch-dealers/index.html" },
      { source: "/private-schools/", destination: "/private-schools/index.html" },
      { source: "/senior-living/", destination: "/senior-living/index.html" },
      { source: "/family-companies/", destination: "/family-companies/index.html" },
      { source: "/luxury/grazie/", destination: "/luxury/grazie.html" },
      { source: "/automotive/grazie/", destination: "/automotive/grazie.html" },
      { source: "/gold-traders/grazie/", destination: "/gold-traders/grazie.html" },
      { source: "/watch-dealers/grazie/", destination: "/watch-dealers/grazie.html" },
      { source: "/private-schools/grazie/", destination: "/private-schools/grazie.html" },
      { source: "/senior-living/grazie/", destination: "/senior-living/grazie.html" },
      { source: "/family-companies/grazie/", destination: "/family-companies/grazie.html" },
    ];
  },
};

export default nextConfig;
