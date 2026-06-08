

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // 👈 add karo
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.parqet.com",
      },
    ],
  },
};
export default nextConfig;