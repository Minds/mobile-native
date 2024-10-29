import React from 'react';
import {
  View,
  StyleProp,
  TextStyle,
  Platform,
  ViewStyle,
  ScrollView,
} from 'react-native';

import TabBarButtonTabBarItem from './TopBarButtonTabBarItem';
import sp from '~/services/serviceProvider';

export type ButtonTabType<T> = {
  id: T;
  title?: string;
  icon?: { name: string; type: string; subtitle?: string };
  testID?: string;
};

type PropsType<T> = {
  tabs: Array<ButtonTabType<T>>;
  current: T;
  onChange: (id: T) => void;
  titleStyle?: StyleProp<TextStyle>;
  buttonCmp?: 'Button' | 'Touchable';
  scrollViewContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * TopBarButtonTabBar Ref
 */
export const topBarButtonTabBarRef = React.createRef<ScrollView>();

/**
 * Tab bar
 */
function TopBarButtonTabBar<T>(props: PropsType<T>) {
  const theme = sp.styles.style;

  return (
    <View style={[theme.rowJustifyStart, theme.bgPrimaryBackground]}>
      <ScrollView
        horizontal
        ref={topBarButtonTabBarRef}
        contentContainerStyle={[
          Platform.OS === 'android'
            ? theme.paddingBottom
            : theme.paddingBottom2x,
          theme.paddingLeft3x,
          props.scrollViewContainerStyle,
        ]}>
        {props.tabs.map((tab, i) => (
          <TabBarButtonTabBarItem
            current={props.current}
            onChange={props.onChange}
            buttonCmp={props.buttonCmp}
            tab={tab}
            key={i}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default TopBarButtonTabBar;
