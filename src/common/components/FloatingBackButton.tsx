import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedStyles from '../../styles/ThemedStyles';

type PropsType = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
};

const FloatingBackButton = (props: PropsType) => {
  const insets = useSafeAreaInsets();
  const iconStyle = { top: insets.top || 5 };
  return (
    <MIcon
      size={props.size || 45}
      name="chevron-left"
      style={[
        styles.backIcon,
        ThemedStyles.style.colorPrimaryText,
        iconStyle,
        props.style,
      ]}
      onPress={props.onPress}
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
