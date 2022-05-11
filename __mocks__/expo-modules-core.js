// const { View } = require('react-native');

export const requireNativeViewManager = viewName => {
  return function (p) {
    null;
  };
};

export const NativeModulesProxy = {
  ExponentAV: {
    setAudioMode: () => jest.fn(),
  },
};

export const createPermissionHook = jest.fn();

export const EventEmitter = require('eventemitter3');

export const Platform = require('react-native').Platform;
