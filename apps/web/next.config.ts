import type { NextConfig } from "next";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  turbopack: {
    root: workspaceRoot
  },
  transpilePackages: ["@bogaap/api-client"],
  async rewrites() {
    const apiOrigin = process.env.NEXT_PUBLIC_API_PROXY_ORIGIN ?? "http://localhost:3001";

    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
