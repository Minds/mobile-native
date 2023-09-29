import React, { Component } from 'react';

import { View, TouchableHighlight, StyleSheet } from 'react-native';

import Icon from '@expo/vector-icons/MaterialIcons';
import MText from './MText';

type PropsType = {
  disabled?: boolean;
  textStyle?: any;
  title: string;
  color: string;
  disabledColor?: string;
  onPress: Function | undefined;
  style?: any;
  hideChevron?: boolean;
  chevronStyle?: any;
  chevronColor?: string;
  chevronSize?: number;
};

export default class NavNextButton extends Component<PropsType> {
  onPressAction = () => {
    if (this.props.disabled) {
      return;
    }

    this.props.onPress && this.props.onPress();
  };

  render() {
    let submitContent;
    if (typeof this.props.title === 'string') {
      submitContent = (
        <MText
          style={[
            style.buttonText,
            this.props.textStyle,
            { color: this.props.color || '#000' },
            !!this.props.disabled && {
              color: this.props.disabledColor || '#aaa',
            },
          ]}>
          {this.props.title}
        </MText>
      );
    } else {
      submitContent = this.props.title;
    }

    return (
      <TouchableHighlight
        activeOpacity={this.props.disabled ? 1 : 0.7}
        underlayColor="transparent"
        onPress={this.onPressAction}
        style={[style.button, this.props.style]}
        testID="NavNextButton">
        <View style={style.row}>
          {submitContent}

          {!this.props.hideChevron && (
            <Icon
              name="chevron-right"
              style={this.props.chevronStyle}
              color={this.props.chevronColor || this.props.color || '#000'}
              size={this.props.chevronSize || 22}
            />
          )}
        </View>
      </TouchableHighlight>
    );
  }
}

const style = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.35,
  },
});
