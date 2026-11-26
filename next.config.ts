import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/files/:path*",
        destination: "http://bahrawy-planet.runasp.net/api/files/:path*",
      },
    ];
  },
};

export default nextConfig;