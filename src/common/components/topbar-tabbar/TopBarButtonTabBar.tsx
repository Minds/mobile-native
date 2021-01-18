import React from 'react';
import { View, StyleProp, TextStyle, StyleSheet } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import Button from '../Button';

export type ButtonTabType<T> = {
  id: T;
  title: string;
};

type PropsType<T> = {
  tabs: Array<ButtonTabType<T>>;
  current: T;
  onChange: (id: T) => void;
  titleStyle?: StyleProp<TextStyle>;
};

/**
 * Tab bar
 */
function TopBarButtonTabBar<T>(props: PropsType<T>) {
  const theme = ThemedStyles.style;

  return (
    <View style={[theme.rowJustifyStart, theme.paddingLeft]}>
      {props.tabs.map((tab, i) => (
        <Button
          onPress={() => props.onChange(tab.id)}
          key={i}
          text={tab.title}
          containerStyle={theme.marginHorizontal}
          active={tab.id === props.current}
          xSmall
        />
      ))}
    </View>
  );
}

export default TopBarButtonTabBar;
