//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class NavNextButton extends Component {
  onPressAction = () => {
    if (this.props.disabled) {
      return;
    }

    this.props.onPress();
  };

  render() {
    let submitContent;
    if (typeof this.props.title === 'string') {
      submitContent = (<Text
        style={[
          style.buttonText,
          this.props.textStyle,
          { color: this.props.color || '#000' },
          !!this.props.disabled && { color: this.props.disabledColor || '#aaa' }
        ]}
      >{this.props.title}</Text>);
    } else {
      submitContent = this.props.title;
    }

    return (
      <TouchableHighlight
        activeOpacity={this.props.disabled ? 1 : 0.7}
        underlayColor="transparent"
        onPress={this.onPressAction}
        style={[
          style.button,
          this.props.style,
        ]}
        testID="NavNextButton"
      >
        <View style={style.row}>
          {submitContent}

          {
            !this.props.hideChevron &&
            <Icon name="chevron-right"
              style={this.props.chevronStyle}
              color={this.props.chevronColor || this.props.color || '#000'}
              size={this.props.chevronSize || 22} />
          }
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
    alignItems: 'center'
  },
  buttonText: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.35,
  }
});
