const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '3000',
            pathname: '/uploads/**',
          },
        ],
    },
};

export default nextConfig;