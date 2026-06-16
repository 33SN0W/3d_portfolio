import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/resume.pdf",
        destination: "/Prateek_resume.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
