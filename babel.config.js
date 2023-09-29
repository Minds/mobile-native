const path = require('path');

process.env.TAMAGUI_TARGET = 'native';
process.env.TAMAGUI_ENABLE_DYNAMIC_LOAD = 1;
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = 1;
const env = process.env.BABEL_ENV || process.env.NODE_ENV;
module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      // { disableImportExportTransform: env !== 'test' },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-transform-flow-strip-types',
      {
        allowDeclareFields: true,
      },
    ],
    ['react-native-reanimated/plugin'],
    [
      'transform-inline-environment-variables',
      {
        include: ['APP_VERSION', 'TAMAGUI_TARGET'],
      },
    ],
    [
      '@tamagui/babel-plugin',
      {
        exclude: /node_modules/,
        config: './tamagui.config.ts',
        components: ['@minds/ui', 'tamagui'],
      },
    ],
    [
      'module-resolver',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          '~': ['./src/'],
          '~ui': ['./src/common/ui'],
          '~styles': ['./src/styles'],
          // 'ReactNativeRenderer-prod':
          //   './node_modules/react-native/Libraries/Renderer/implementations/ReactNativeRenderer-profiling',
          // 'scheduler/tracing': 'scheduler/tracing-profiling',
          app: path.resolve(__dirname, 'src/app'),
          assets: path.resolve(__dirname, 'src/assets'),
          components: path.resolve(__dirname, 'src/components'),
          modules: path.resolve(__dirname, 'src/modules'),
          services: path.resolve(__dirname, 'src/services'),
          styles: path.resolve(__dirname, 'src/styles'),
          utils: path.resolve(__dirname, 'src/utils'),
          '@minds/ui': path.resolve(__dirname, 'packages/design-system/src'),
        },
      },
    ],
  ],
};
