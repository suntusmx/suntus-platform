import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@suntus/ui", "@suntus/core"],
};

export default nextConfig;
