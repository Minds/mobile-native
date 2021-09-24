import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';

export default function IconButton({ onPress = null, style, ...extra }: any) {
  const containerStyles: any = [styles.container];
  let size = 'medium';

  if (style) {
    containerStyles.push(style);
  }

  if (extra?.size) {
    size = extra.size;
  }

  containerStyles.push(styles[size]);

  const onStyle = ({ pressed }: any) => {
    const _styles = [...containerStyles];
    if (pressed === true) {
      _styles.push(styles.pressed);
    }
    return _styles;
  };

  return (
    <Pressable style={onStyle} onPress={onPress}>
      <Icon {...extra} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.75,
  },
  small: {
    padding: 4,
  },
  medium: {
    padding: 4,
  },
  large: {
    padding: 8,
  },
});
