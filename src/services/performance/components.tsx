import React from 'react';
import { useProfiledNavigation } from '@shopify/react-native-performance-navigation';
import {
  ParamListBase,
  useNavigation as useNativeNavigation,
} from '@react-navigation/native';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator as createNativeBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createProfiledBottomTabNavigator } from '@shopify/react-native-performance-navigation-bottom-tabs';
import {
  FlashListPerformanceView,
  FlatListPerformanceView,
} from '@shopify/react-native-performance-lists-profiler';

import { IS_PERFMON_ENABLED } from '~/config/Config';

export const useNavigation = IS_PERFMON_ENABLED
  ? useProfiledNavigation
  : useNativeNavigation;

type ParamListBaseAlt = {
  [key: string]: { [key: string]: unknown } | {} | undefined;
};
export function createBottomTabNavigator<
  T extends ParamListBase | ParamListBaseAlt
>() {
  if (IS_PERFMON_ENABLED) {
    const {
      Tab,
      buildProfiledBottomTabBarButton,
    } = createProfiledBottomTabNavigator();
    const tabBarButton = (props: BottomTabBarButtonProps) =>
      buildProfiledBottomTabBarButton()(props as any);
    return { Tab, tabBarButton };
  }
  const Tab = createNativeBottomTabNavigator<T>();
  return { Tab, tabBarButton: undefined };
}

type PerformanceListType = React.PropsWithChildren<any> & { name?: string };
export function PerformanceFlashListWrapper({
  children,
  name,
}: PerformanceListType) {
  if (IS_PERFMON_ENABLED) {
    return (
      <FlashListPerformanceView listName={name ?? 'FlashList'}>
        {children}
      </FlashListPerformanceView>
    );
  }
  return <>{children}</>;
}

export function PerformanceListWrapper({
  children,
  name,
}: PerformanceListType) {
  if (IS_PERFMON_ENABLED) {
    return (
      <FlatListPerformanceView listName={name ?? 'FlashList'}>
        {children}
      </FlatListPerformanceView>
    );
  }
  return <>{children}</>;
}
