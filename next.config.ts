import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  },
};

export default nextConfig;
