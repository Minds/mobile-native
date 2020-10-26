import React from 'react';
import { View } from 'react-native';

export const SafeAreaView = function NavigationContainer(props) {
  return <View>{props.children}</View>;
};

export const useSafeArea = function () {
  return {
    top: 0,
    bottom: 0,
  };
};
export const useSafeAreaInsets = function () {
  return {
    top: 0,
    bottom: 0,
  };
};
