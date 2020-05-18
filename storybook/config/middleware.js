const path = require('path');

const express = require('express');
const proxy = require('http-proxy-middleware');

module.exports = router =>
  router
    .use(
      '/portal/app',
      express.static(
        path.join(__dirname, '../../node_modules/font-awesome/fonts')
      )
    )
    .use(
      '/portal/app/public',
      express.static(path.join(__dirname, '../../ng-app/public'))
    )
    .use(
      '/buyflow/rest',
      proxy({
        target: 'http://localhost:3000',
        pathRewrite: {'^/buyflow/rest': ''}
      })
    )
    .use(
      '/portal/rest',
      proxy({
        target: 'http://localhost:3000',
        pathRewrite: {'^/portal/rest': ''}
      })
    )
    .use(
      '/assets/images/thumb',
      proxy({
        target: 'https://www.vodafone.de',
        pathRewrite: {
          '^/assets/images/thumb': '/media/img/products/NSF-90x120'
        },
        changeOrigin: true
      })
    )
    .use(
      '/assets/images/small',
      proxy({
        target: 'https://www.vodafone.de',
        pathRewrite: {
          '^/assets/images/small': '/media/img/products/170x230'
        },
        changeOrigin: true
      })
    )
    .use(
      '/assets/images/large',
      proxy({
        target: 'https://www.vodafone.de',
        pathRewrite: {'^/assets/images/large': '/media/img/products/228x309'},
        changeOrigin: true
      })
    );
