import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: "/about-us/timeline", destination: "/timeline", permanent: false },
      { source: "/about-us/timeline/", destination: "/timeline/", permanent: false },
      { source: "/about-us/team", destination: "/team", permanent: false },
      { source: "/about-us/team/", destination: "/team/", permanent: false },
    ];
  },
};

export default nextConfig;
