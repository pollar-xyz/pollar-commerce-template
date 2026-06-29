import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static product images come from picsum in the demo catalog. Swap for your
  // own CDN/domain in a real storefront.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
