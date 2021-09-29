import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ThemedStyles from '../../../styles/ThemedStyles';
import MText from '../MText';

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
        theme.paddingHorizontal2x,
        props.containerStyle,
      ]}>
      <ScrollView horizontal ref={topbarTabbarRef}>
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
            <MText
              style={[
                theme.fontL,
                tab.id === props.current
                  ? theme.colorPrimaryText
                  : theme.colorSecondaryText,
                props.titleStyle,
              ]}>
              {tab.title}
            </MText>
            {!!tab.subtitle && (
              <MText
                style={[
                  theme.fontL,
                  theme.colorSecondaryText,
                  styles.subtitle,
                  props.subtitleStyle,
                ]}>
                {tab.subtitle}
              </MText>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default TopbarTabbar;

const styles = StyleSheet.create({
  subtitle: {
    paddingVertical: 2,
  },
});
