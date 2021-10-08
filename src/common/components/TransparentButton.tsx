//@ts-nocheck
import React, { Component } from 'react';

import { TouchableHighlight, Text, StyleSheet } from 'react-native';
import { ComponentsStyle } from '../../styles/Components';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from './MText';

export default class TransparentButton extends Component {
  onPressAction = () => {
    if (this.props.disabled) {
      return;
    }

    this.props.onPress();
  };

  render() {
    const {
      textStyle,
      disabled,
      title,
      style,
      borderColor,
      color,
      disabledBorderColor,
      disabledColor,
      ...otherProps
    } = this.props;

    let submitContent;
    if (typeof title === 'string') {
      submitContent = (
        <MText
          style={[
            ThemedStyles.style.paddingHorizontal,
            styles.buttonText,
            textStyle,
            { color: color || '#000' },
            !!disabled && { color: disabledColor || '#aaa' },
          ]}>
          {title}
        </MText>
      );
    } else {
      submitContent = title;
    }

    return (
      <TouchableHighlight
        activeOpacity={disabled ? 1 : 0.7}
        underlayColor="transparent"
        onPress={this.onPressAction}
        style={[
          ComponentsStyle.button,
          styles.button,
          style,
          { borderColor: borderColor || color || '#000' },
          !!disabled && {
            borderColor: disabledBorderColor || disabledColor || '#aaa',
          },
        ]}
        {...otherProps}>
        {submitContent}
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    textAlign: 'center',
  },
});
