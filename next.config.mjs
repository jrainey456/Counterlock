/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-bucket.deadlock-api.com",
        pathname: "/assets-api-res/images/heroes/**",
      },
      {
        protocol: "https",
        hostname: "assets-bucket.deadlock-api.com",
        pathname: "/assets-api-res/images/items/**",
      },
      {
        protocol: "https",
        hostname: "assets.characterselectscreen.com",
        pathname: "/games/deadlock/backgrounds/**",
      },
      {
        protocol: "https",
        hostname: "assets.characterselectscreen.com",
        pathname: "/games/deadlock/characters/**",
      },
    ],
  },
};

export default nextConfig;