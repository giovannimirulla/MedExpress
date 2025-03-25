import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['antd', '@ant-design/icons']
};

export default nextConfig;
