import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ThemedStyles from '../../../styles/ThemedStyles';
import { B1, B2 } from '~ui';

export type TabType<T> = {
  id: T;
  title: string;
  subtitle?: string;
};

type PropsType<T> = {
  tabs: Array<TabType<T>>;
  current: T;
  onChange: (id: T) => void;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * topbarTabbarRef Ref
 */
export const topbarTabbarRef = React.createRef<ScrollView>();

/**
 * Tab bar
 */
function TopbarTabbar<T>(props: PropsType<T>) {
  const theme = ThemedStyles.style;
  const tabStyle = [
    theme.paddingVertical2x,
    theme.marginHorizontal2x,
    theme.borderBottom4x,
  ];

  return (
    <View
      style={[
        theme.rowJustifyStart,
        theme.borderBottom,
        theme.bcolorPrimaryBorder,
        props.containerStyle,
      ]}>
      <ScrollView
        contentContainerStyle={theme.marginHorizontal2x}
        horizontal
        ref={topbarTabbarRef}>
        {props.tabs.map((tab, i) => (
          <TouchableOpacity
            onPress={() => props.onChange(tab.id)}
            key={i}
            style={[
              tabStyle,
              props.tabStyle,
              tab.id === props.current
                ? theme.bcolorTabBorder
                : theme.bcolorTransparent,
            ]}>
            <B1
              font="medium"
              horizontal="XS"
              color={tab.id === props.current ? 'link' : 'secondary'}>
              {tab.title}
            </B1>
            {!!tab.subtitle && <B2 vertical="XXXS">{tab.subtitle}</B2>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default TopbarTabbar;
