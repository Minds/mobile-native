import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ThemedStyles from '../../styles/ThemedStyles';
import Button from './Button';

type PropsType = {
  containerStyle?: ViewStyle | Array<ViewStyle>;
  childrenButton1: React.ReactNode;
  childrenButton2?: React.ReactNode;
  onPress?: () => void;
};

const SegmentedButton = (props: PropsType) => {
  const theme = ThemedStyles.style;
  const buttonStyle = {
    borderColor: ThemedStyles.theme
      ? ThemedStyles.getColor('primary_border')
      : '#FFFFFF',
    backgroundColor: ThemedStyles.theme
      ? ThemedStyles.getColor('primary_background')
      : ThemedStyles.getColor('primary_border'),
  };
  return (
    <TouchableOpacity
      style={[theme.rowJustifyStart, props.containerStyle]}
      onPress={props.onPress}>
      <Button
        containerStyle={[
          buttonStyle,
          !props.childrenButton2 ? styles.button : styles.leftButton,
        ]}>
        {props.childrenButton1}
      </Button>
      {props.childrenButton2 && (
        <Button containerStyle={[buttonStyle, styles.rightButton]}>
          {props.childrenButton2}
        </Button>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingLeft: 15,
    paddingRight: 10,
  },
  leftButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingLeft: 15,
    paddingRight: 10,
  },
  rightButton: {
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingLeft: 10,
    paddingRight: 15,
  },
});

export default SegmentedButton;
