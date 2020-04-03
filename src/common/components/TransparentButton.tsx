//@ts-nocheck
import React, { Component } from 'react';

import {
  TouchableHighlight,
  Text,
  StyleSheet
} from 'react-native';
import { ComponentsStyle } from '../../styles/Components';
import { CommonStyle } from '../../styles/Common';

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
      submitContent = (<Text
        style={[
          CommonStyle.paddingLeft,
          CommonStyle.paddingRight,
          styles.buttonText,
          textStyle,
          { color: color || '#000' },
          !!disabled && { color: disabledColor || '#aaa' }
        ]}
      >{title}</Text>);
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
          !!disabled && { borderColor: disabledBorderColor || disabledColor || '#aaa' }
        ]}
        {...otherProps}
      >
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
  }
});
