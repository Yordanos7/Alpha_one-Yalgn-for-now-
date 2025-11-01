import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: ["@alpha/db", "@alpha/api"], // Add packages to transpile
  images: {
    domains: ["www.ethiotelecom.et", "github.com", "placehold.co", "localhost"], // Add the domain for the external image
  },
};

export default nextConfig;
