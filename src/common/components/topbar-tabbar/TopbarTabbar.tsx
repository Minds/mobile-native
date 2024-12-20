import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
  ScrollView,
} from 'react-native';

import { B1, B2 } from '~ui';
import sp from '~/services/serviceProvider';

export type TabType<T> = {
  id: T;
  title: string;
  subtitle?: string;
  testID?: string;
};

type PropsType<T> = {
  tabs: Array<TabType<T>>;
  current: T;
  onChange: (id: T) => void;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  right?: React.ReactNode;
};

/**
 * topbarTabbarRef Ref
 */
export const topbarTabbarRef = React.createRef<ScrollView>();

/**
 * Tab bar
 */
function TopbarTabbar<T>(props: PropsType<T>) {
  const theme = sp.styles.style;

  return (
    <View
      style={[
        theme.rowJustifyStart,
        theme.borderBottom,
        theme.bcolorPrimaryBorder,
        props.containerStyle,
      ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={topbarTabbarRef}>
        {props.tabs.map((tab, i) => (
          <TouchableOpacity
            onPress={() => props.onChange(tab.id)}
            key={i}
            testID={tab.testID}
            style={[
              tab.id === props.current
                ? styles.tabStyleCurrent
                : styles.tabStyle,
              props.tabStyle,
            ]}>
            <B1
              font="medium"
              color={tab.id === props.current ? 'primary' : 'secondary'}>
              {tab.title}
            </B1>
            {!!tab.subtitle && <B2 vertical="XXXS">{tab.subtitle}</B2>}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {props.right}
    </View>
  );
}

export default TopbarTabbar;

const styles = sp.styles.create({
  scrollContainer: ['marginHorizontal2x', 'paddingRight4x'],
  tabStyleCurrent: [
    'paddingVertical2x',
    'marginTop',
    'marginHorizontal3x',
    'borderBottom5x',
    'bcolorTabBorder',
  ],
  tabStyle: [
    'paddingVertical2x',
    'marginTop',
    'marginHorizontal3x',
    'borderBottom5x',
    'bcolorTransparent',
  ],
});
