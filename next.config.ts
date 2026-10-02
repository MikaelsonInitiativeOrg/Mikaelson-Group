import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Blog covers uploaded through the Studio live in the public Vercel Blob store.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
