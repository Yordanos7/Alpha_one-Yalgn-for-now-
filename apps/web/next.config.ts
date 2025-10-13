import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    domains: ["www.ethiotelecom.et", "github.com", "placehold.co"], // Add the domain for the external image
  },
};

export default nextConfig;
