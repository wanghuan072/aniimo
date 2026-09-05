import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/database/forms", destination: "/aniimo", permanent: true },
      { source: "/guides/how-to-choose-your-first-aniimo", destination: "/guides/aniimo-forms-and-evolution", permanent: true },
      { source: "/guides/aniimo-elements-and-roles-explained", destination: "/guides/aniimo-combat-guide", permanent: true },
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
