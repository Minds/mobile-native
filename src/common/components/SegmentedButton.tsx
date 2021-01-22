import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';
import Button from './Button';

type PropsType = {
  containerStyle?: ViewStyle | Array<ViewStyle>;
  childrenButton1: React.ReactNode;
  childrenButton2?: React.ReactNode;
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
    <View style={[theme.rowJustifyStart, props.containerStyle]}>
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
    </View>
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
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingLeft: 10,
    paddingRight: 15,
  },
});

export default SegmentedButton;
