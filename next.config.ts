import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/database/forms", destination: "/aniimo", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "worldx-website-cdn.aniimo.com",
        pathname: "/official-website/**",
      },
    ],
  },
};

export default nextConfig;
