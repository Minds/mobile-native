import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import ThemedStyles from '../../../styles/ThemedStyles';
import MText from '../MText';

interface SelectProps {
  label: string;
  onPress: () => any;
}

const Select = ({ label, onPress }: SelectProps) => {
  const theme = ThemedStyles.style;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ padding: 5 }}>
      <View
        style={[
          theme.rowJustifySpaceBetween,
          theme.padding2x,
          theme.bcolorPrimaryBorder,
          styles.container,
        ]}>
        <MText style={styles.label}>{label}</MText>
        <Icon
          name={'arrow-drop-down'}
          size={15}
          style={[styles.icon, theme.colorIcon]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'transparent',
    borderRadius: 3,
  },
  label: {},
  icon: {},
});
