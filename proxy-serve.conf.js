module.exports = [
  {
    context: ['/portal/app'],
    target: 'https://localhost:8099',
    pathRewrite: {'^/portal/app': ''},
    secure: false
  },
  {
    context: [
      '/buyflow/rest/**',
      '/portal/rest/**',
      '/fixedline/rest/**',
      '/ed/rest/**'
    ],
    target: 'https://localhost:7002',
    secure: false
  }
];
