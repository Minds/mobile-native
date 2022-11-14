const path = require('path');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanOCR'],
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
        },
      },
    ],
  ],
};
