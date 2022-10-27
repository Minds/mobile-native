import React from 'react';
import { View } from 'react-native';

export { ErrorGlobalWrapper } from './errorGlobalWrapper';
export { WidgetWrapper } from './widgetWrapper';
export { Icon } from './icon';
export type WrapperHandle = {
  loadingStart: () => void;
  loadingStop: () => void;
};

export type { IconStyle } from './icon';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const BottomNavigationTab = (props: any) => <View />;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const BottomNavigation = (props: any) => <View />;
export const useTheme = React.useRef;
