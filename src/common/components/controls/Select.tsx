import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedStyles from '../../../styles/ThemedStyles';

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
          theme.borderPrimary,
          styles.container,
        ]}>
        <Text style={styles.label}>{label}</Text>
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
