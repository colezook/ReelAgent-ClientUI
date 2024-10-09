module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/trending',
        permanent: true,
      },
    ];
  },
};