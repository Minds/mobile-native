import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeArea } from 'react-native-safe-area-context';
import ThemedStyles from '../../styles/ThemedStyles';

type PropsType = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const FloatingBackButton = (props: PropsType) => {
  const insets = useSafeArea();
  const iconStyle = { top: insets.top || 5 };
  return (
    <MIcon
      size={45}
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
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
