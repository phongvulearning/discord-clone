/** @type {import('next').NextConfig} */
const nextConfig = {
  //   webpack: (config) => {
  //     config.externals.push({
  //       bufferutil: "commonjs bufferutil",
  //       "utf-8-validate": "commonjs utf-8-validate",
  //     });
  //
  //     return config;
  //   },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
