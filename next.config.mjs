/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['eu-central-1.storage.xata.sh'],
  },
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, 'esbuild'];

    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        sideEffects: true,
        usedExports: true,
      };
    }

    return config;
  },
};

export default nextConfig;
