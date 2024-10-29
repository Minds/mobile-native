import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Button from './Button';
import sp from '~/services/serviceProvider';

type PropsType = {
  containerStyle?: ViewStyle | Array<ViewStyle>;
  childrenButton1: React.ReactNode;
  childrenButton2?: React.ReactNode;
  onPress?: () => void;
};

const SegmentedButton = (props: PropsType) => {
  const theme = sp.styles.style;
  const buttonStyle = {
    borderColor: sp.styles.theme
      ? sp.styles.getColor('PrimaryBorder')
      : '#FFFFFF',
    backgroundColor: sp.styles.theme
      ? sp.styles.getColor('PrimaryBackground')
      : sp.styles.getColor('PrimaryBorder'),
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
