// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: "export",
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "images.unsplash.com"
//       },
//       {
//         protocol: "https",
//         hostname: "images.pexels.com"
//       }
//     ]
//   },
//   outputFileTracingRoot: __dirname
// };

// export default nextConfig;


import type { NextConfig } from "next";
import path from "path";

const imageKitHostname = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  ? new URL(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      ...(imageKitHostname
        ? [
            {
              protocol: "https" as const,
              hostname: imageKitHostname
            }
          ]
        : [])
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "..")
};

export default nextConfig;
