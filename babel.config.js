module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          '~': ['./src/'],
          '~ui': ['./src/common/ui'],
          '~styles': ['./src/styles'],
          'ReactNativeRenderer-prod':
            './node_modules/react-native/Libraries/Renderer/implementations/ReactNativeRenderer-profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        },
      },
    ],
  ],
};
