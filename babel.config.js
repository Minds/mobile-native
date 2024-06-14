const path = require('path');

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
      'module-resolver',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          '@assets': ['./assets'],
          '~': ['./src/'],
          '~ui': ['./src/common/ui'],
          '~styles': ['./src/styles'],
          // 'ReactNativeRenderer-prod':
          //   './node_modules/react-native/Libraries/Renderer/implementations/ReactNativeRenderer-profiling',
          // 'scheduler/tracing': 'scheduler/tracing-profiling',
          app: path.resolve(__dirname, 'src/app'),
          components: path.resolve(__dirname, 'src/components'),
          modules: path.resolve(__dirname, 'src/modules'),
          services: path.resolve(__dirname, 'src/services'),
          styles: path.resolve(__dirname, 'src/styles'),
          utils: path.resolve(__dirname, 'src/utils'),
        },
      },
    ],
  ],
};
