import React from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import sp from '~/services/serviceProvider';

export default function ListItemButton(
  props: TouchableOpacityProps & {
    children: React.ReactNode;
    style?: ViewStyle;
  },
) {
  const theme = sp.styles.style;
  return (
    <TouchableOpacity
      {...props}
      //@ts-ignore
      borderRadius={2}
      style={[
        styles.container,
        theme.bcolorPrimaryBorder,
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
