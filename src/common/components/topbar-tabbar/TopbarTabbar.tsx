import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  StyleSheet,
  ViewStyle,
  ScrollView,
  Dimensions,
} from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';

const { width } = Dimensions.get('window');

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
 * Tab bar
 */
function TopbarTabbar<T>(props: PropsType<T>) {
  const theme = ThemedStyles.style;
  const tabStyle = [
    theme.paddingVertical2x,
    theme.marginHorizontal2x,
    theme.borderBottom4x,
  ];
  const [renderScroll, setRenderScroll] = useState(false);

  const onLayout = e => {
    if (renderScroll === true) {
      return;
    }
    const edge = e.nativeEvent.layout.width + e.nativeEvent.layout.x;
    if (edge > width) {
      setRenderScroll(true);
    }
  };

  const renderNav = () => {
    const items = props.tabs.map((tab, i) => (
      <TouchableOpacity
        onLayout={onLayout}
        onPress={() => props.onChange(tab.id)}
        key={i}
        style={[
          tabStyle,
          props.tabStyle,
          tab.id === props.current ? theme.borderTab : theme.borderTransparent,
        ]}>
        <Text
          style={[
            theme.fontL,
            tab.id === props.current
              ? theme.colorPrimaryText
              : theme.colorSecondaryText,
            props.titleStyle,
          ]}>
          {tab.title}
        </Text>
        {!!tab.subtitle && (
          <Text
            style={[
              theme.fontL,
              theme.colorSecondaryText,
              styles.subtitle,
              props.subtitleStyle,
            ]}>
            {tab.subtitle}
          </Text>
        )}
      </TouchableOpacity>
    ));

    if (renderScroll === true) {
      return <ScrollView horizontal>{items}</ScrollView>;
    }

    return items;
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        theme.rowJustifyStart,
        theme.borderBottom,
        theme.borderPrimary,
        theme.paddingHorizontal2x,
        props.containerStyle,
      ]}>
      {renderNav()}
    </View>
  );
}

export default TopbarTabbar;

const styles = StyleSheet.create({
  subtitle: {
    paddingVertical: 2,
  },
});
