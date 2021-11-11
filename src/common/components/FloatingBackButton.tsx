import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from '~ui/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PropsType = {
  onPress: () => void;
  style?: any;
  size?: number | string;
  light?: boolean;
  icon?: string;
  shadow?: boolean;
};

const FloatingBackButton = (props: PropsType) => {
  const insets = useSafeAreaInsets();
  const iconStyle = { top: insets.top || 5 };
  return (
    <IconButton
      size={props.size || 'huge'}
      name={props.icon || 'chevron-left'}
      style={[iconStyle, styles.backIcon, props.style]}
      onPress={props.onPress}
      light={props.light}
      shadow={props.shadow}
      testID="floatingBackButton"
    />
  );
};

export default FloatingBackButton;

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    left: 0,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
    elevation: 4,
  },
});
