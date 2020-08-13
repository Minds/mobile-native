import React from 'react';
import { View } from 'react-native';

export const SafeAreaView = function NavigationContainer(props) {
  return <View>{props.children}</View>;
};
