module.exports = ({config}) => {
  config.module.rules.push({
    test: /\.stories\.ts$/,
    loaders: [
      {
        loader: require.resolve('@storybook/source-loader'),
        options: {parser: 'typescript'}
      }
    ],
    enforce: 'pre'
  });

  config.resolveLoader = {
    alias: {
      ast: require.resolve('./loaders/ast-loader.js'),
      'scss-to-json': require.resolve('./loaders/scss-to-json-loader.js')
    }
  };

  return config;
};
