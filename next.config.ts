import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
  },
};

export default nextConfig;
