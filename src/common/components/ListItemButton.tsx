import React from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

export default function ListItemButton(
  props: TouchableOpacityProps & {
    children: React.ReactNode;
    style?: ViewStyle;
  },
) {
  const theme = ThemedStyles.style;
  return (
    <TouchableOpacity
      {...props}
      //@ts-ignore
      borderRadius={2}
      style={[
        styles.container,
        theme.borderPrimary,
        theme.centered,
        props.style,
      ]}>
      {props.children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 4,
  },
});
