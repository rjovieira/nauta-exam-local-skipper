const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Custom resolver to fix tslib resolution error on web/metro.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib') {
    return context.resolveRequest(context, 'tslib/tslib.es6.js', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
