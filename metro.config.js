const { getDefaultConfig } = require('@expo/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const path = require('path');

const workspaceRoot = __dirname;
const projectRoot = __dirname;

const config = getSentryExpoConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

console.log('RESOLVE', require.resolve('./src/services/serviceProvider.ts'));

// Override getTransformOptions so we can turn inlineRequires on
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
    inlineRequires: {
      blockList: {
        // require() calls in `DoNotInlineHere.js` will not be inlined.
        [require.resolve('./src/services/serviceProvider.ts')]: true,

        // require() calls anywhere else will be inlined, unless they
        // match any entry nonInlinedRequires (see below).
      },
    },
    nonInlinedRequires: [
      // We can remove this option and rely on the default after
      // https://github.com/facebook/metro/pull/1126 is released.
      'React',
      'react',
      'react/jsx-dev-runtime',
      'react/jsx-runtime',
      'react-native',
    ],
    unstable_disableES6Transforms: false,
  },
  preloadedModules: false,
  ramGroups: [],
});

module.exports = config;
