const withTM = require('next-transpile-modules')(['pg', 'pg-connection-string']);

module.exports = withTM({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
});