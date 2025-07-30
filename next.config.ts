import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "verbose-space-halibut-j9v77v5jq5v2p4rx.github.dev",
      ],
    },
  },
};

export default nextConfig;
