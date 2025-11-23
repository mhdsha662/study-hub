import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Set to false for production
  },
  reactStrictMode: true, // Enable for production
  eslint: {
    ignoreDuringBuilds: false, // Set to false for production
  },
  images: {
    domains: ['your-supabase-project.supabase.co'], // Add your Supabase storage domain
  },
};

export default nextConfig;
