module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/start',
        permanent: true,
      },
    ];
  },
};