import type { NextConfig } from "next";

const supabaseHostname = (() => {
  try {
    const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return value ? new URL(value).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [{ protocol: "https", hostname: supabaseHostname, pathname: "/storage/v1/object/public/site-media/**" }]
      : [],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
