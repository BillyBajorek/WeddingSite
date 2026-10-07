import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Replit's workspace preview proxies the dev server through these domains.
  allowedDevOrigins: ["**.replit.dev", "**.repl.co", "127.0.0.1"],
};

export default nextConfig;
