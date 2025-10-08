const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

const absolutePath = path.join(__dirname, '../src');

module.exports = {
  webpack: {
    configure: webpackConfig => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName('babel-loader')
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat(absolutePath);
      }

      // Remove ModuleScopePlugin which restricts imports outside src/
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        plugin => plugin.constructor.name !== 'ModuleScopePlugin'
      );

      return webpackConfig;
    },
  },
};
