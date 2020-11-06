import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLayout } from '@react-native-community/hooks';

const Triangle = ({ style, isDown }) => (
  <View
    style={StyleSheet.flatten([
      styles.triangle,
      style,
      isDown ? styles.down : {},
    ])}
  />
);

export default function Tooltip({
  backgroundColor,
  children,
  containerStyle,
  bottom = 0,
}) {
  const bgStyle = { backgroundColor };
  const { onLayout, ...layout } = useLayout();

  const containerPosition = {
    opacity: layout && layout.height ? 1 : 0,
    top: -(layout.height - bottom),
  };

  return (
    <View style={[styles.container, containerPosition]} onLayout={onLayout}>
      <View style={[styles.bubble, containerStyle, bgStyle]}>{children}</View>
      <Triangle style={{ borderBottomColor: backgroundColor }} isDown={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    width: '90%',
    zIndex: 1999,
  },
  bubble: {
    borderRadius: 2,
    padding: 6,
  },
  down: {
    transform: [{ rotate: '180deg' }],
  },
  triangle: {
    marginLeft: 15,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
});
