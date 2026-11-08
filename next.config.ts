import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Hide the floating "N" dev badge; it only ever shows under `next dev`.
  devIndicators: false,
};

export default nextConfig;
