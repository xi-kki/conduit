/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile Sui packages for proper SSR handling
  transpilePackages: [
    "@mysten/sui",
    "@mysten/sui/dist",
    "@mysten/dapp-kit",
    "@mysten/dapp-kit/dist",
  ],
  // webpack config for Sui packages
  webpack: (config, { isServer }) => {
    // Fix for Sui packages that use Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
