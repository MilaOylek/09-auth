import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      { protocol: "https", hostname: "notehub-public.goit.study" },
    ],
  },

  async headers() {
    return [
      {
        source: '/notes/filter/:slug',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, must-revalidate',
          },
        ],
      },
    ]
  }
}
export default nextConfig;
