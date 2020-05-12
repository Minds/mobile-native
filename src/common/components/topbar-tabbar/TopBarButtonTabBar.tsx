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
  const tabStyle = [styles.button, theme.marginHorizontal3x];

  return (
    <View style={theme.rowJustifyStart}>
      {props.tabs.map((tab) => (
        <Button
          onPress={() => props.onChange(tab.id)}
          text={tab.title}
          textStyle={[
            theme.fontMedium,
            props.current !== tab.id ? theme.colorTertiaryText : null,
          ]}
          containerStyle={[
            tabStyle,
            props.current !== tab.id ? theme.backgroundTransparent : null,
          ]}
        />
      ))}
    </View>
  );
}

export default TopBarButtonTabBar;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
  },
});
