const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../');
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Override getTransformOptions so we can turn inlineRequires on
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
    unstable_disableES6Transforms: false,
  },
  preloadedModules: false,
  ramGroups: [],
});

module.exports = config;
