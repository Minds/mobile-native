import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type PropsType = {
  leftText: string;
  rightText: string;
  leftValue: any;
  rightValue: any;
  initialValue: any;
  onSelectedValueChange: Function;
};

const createMindsSwitchStore = ({
  leftValue,
  rightValue,
  initialValue,
  onSelectedValueChange,
}) => {
  const store = {
    selectedValue: initialValue,
    selectedValueChange() {
      this.selectedValue =
        this.selectedValue === leftValue ? rightValue : leftValue;
      onSelectedValueChange(this.selectedValue);
    },
    isSelected(value) {
      return this.selectedValue === value;
    },
  };
  return store;
};

const MindsSwitch = observer(
  ({
    leftText,
    rightText,
    leftValue,
    rightValue,
    initialValue,
    onSelectedValueChange,
  }: PropsType) => {
    const theme = ThemedStyles.style;
    const textStyle = [styles.text, theme.colorPrimaryText];
    const localStore = useLocalStore(createMindsSwitchStore, {
      leftValue,
      rightValue,
      initialValue,
      onSelectedValueChange,
    });
    return (
      <View style={theme.rowJustifyStart}>
        <TouchableOpacity
          style={[
            theme.rowJustifyStart,
            theme.mindsSwitchBackgroundPrimary,
            theme.border,
            theme.borderRadius2x,
            theme.borderPrimary,
          ]}
          activeOpacity={0.65}
          onPress={localStore.selectedValueChange}>
          <Text
            style={[
              ...textStyle,
              localStore.isSelected(leftValue)
                ? theme.mindsSwitchBackgroundSecondary
                : null,
            ]}>
            {leftText}
          </Text>
          <Text
            style={[
              ...textStyle,
              localStore.isSelected(rightValue)
                ? theme.mindsSwitchBackgroundSecondary
                : null,
            ]}>
            {rightText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    padding: 10,
  },
});

export default MindsSwitch;
