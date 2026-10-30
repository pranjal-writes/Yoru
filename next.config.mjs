/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.118.52.163'],

  /* config options here */
   transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
      "*.mp3": {
        loaders: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash].[ext]'
            }
          }
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
