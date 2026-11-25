import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "bahrawy-planet.runasp.net",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;