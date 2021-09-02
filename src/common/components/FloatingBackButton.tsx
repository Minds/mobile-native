import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedStyles from '../../styles/ThemedStyles';

type PropsType = {
  onPress: () => void;
  style?: any;
  size?: number;
};

const FloatingBackButton = (props: PropsType) => {
  const insets = useSafeAreaInsets();
  const iconStyle = { top: insets.top || 5 };
  return (
    <TouchableOpacity onPress={props.onPress}>
      <MIcon
        size={props.size || 45}
        name="chevron-left"
        style={[
          styles.backIcon,
          ThemedStyles.style.colorPrimaryText,
          iconStyle,
          props.style,
        ]}
        testID="floatingBackButton"
      />
    </TouchableOpacity>
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
