import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error - turbopack is not yet in the type definition but is required to fix the warning
    turbopack: {
      // Set the root directory for Turbopack to the current working directory
      // to resolve the warning about multiple lockfiles.
      root: process.cwd(),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
