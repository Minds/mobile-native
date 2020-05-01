import React from 'react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

import type { StyleProp, TextStyle, GestureResponderEvent } from 'react-native';

type PropsType = {
  name: string;
  style?: StyleProp<TextStyle>;
  onPress: (event: GestureResponderEvent) => void;
};

const SmallCircleButton = (props: PropsType) => {
  const theme = ThemedStyles.style;
  const themeSmallButton = [theme.colorIcon, theme.backgroundPrimary];
  return (
    <MIcon
      size={14}
      name="camera"
      style={[styles.smallButton, ...themeSmallButton, props.style]}
      onPress={props.onPress}
    />
  );
};

const styles = StyleSheet.create({
  smallButton: {
    shadowOpacity: 0.4,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
    borderRadius: 53,
    padding: 5,
  },
});

export default SmallCircleButton;
