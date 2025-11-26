import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  basePath: '/sbd-nextjs-myaccount',
  assetPrefix: '/sbd-nextjs-myaccount',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
