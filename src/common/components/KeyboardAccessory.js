import React, { PureComponent } from 'react';
import {
  View,
  Platform,
  Keyboard,
  UIManager,
  StyleSheet,
  LayoutAnimation
} from 'react-native';

import isIphoneX from '../helpers/isIphoneX';

const SAFE_AREA_BOTTOM_HEIGHT = 34;

/**
 * Based on https://github.com/just4fun/react-native-sticky-keyboard-accessory
 * fixed for android
 */
export default class KeyboardAccessory extends PureComponent {
  static defaultProps = {
    backgroundColor: '#f6f6f6'
  }

  constructor(props) {
    super(props);
    this.state = {
      bottom: 0,
    };
    // Enable `LayoutAnimation` for Android.
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  /**
   * Component did mount
   */
  componentDidMount() {
    if (!this.props.noFloat) {
      let keyboardShowEvent = 'keyboardWillShow';
      let keyboardHideEvent = 'keyboardWillHide';

      if (Platform.OS === 'android') {
        keyboardShowEvent = 'keyboardDidShow';
        keyboardHideEvent = 'keyboardDidHide';
      }

      this.keyboardShowListener = Keyboard.addListener(keyboardShowEvent, (e) => this.keyboardShow(e));
      this.keyboardHideListener = Keyboard.addListener(keyboardHideEvent, (e) => this.keyboardHide(e));
    }
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    this.keyboardShowListener && this.keyboardShowListener.remove();
    this.keyboardHideListener && this.keyboardHideListener.remove();
  }

  keyboardShow(e) {
    let bottom;
    LayoutAnimation.easeInEaseOut();

    if (Platform.OS === 'android') {
      bottom = 0;
    } else {
      bottom = isIphoneX() ? (e.endCoordinates.height - SAFE_AREA_BOTTOM_HEIGHT) : e.endCoordinates.height;
    }

    if (this.state.bottom != bottom) {
      this.setState({ bottom });
    }
  }

  /**
   * On keyboard hide
   * @param {event} e
   */
  keyboardHide(e) {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      bottom: 0
    });
  }

  /**
   * Render
   */
  render() {
    let { bottom } = this.state;
    let { children, backgroundColor } = this.props;

    if (!children) {
      throw new Error('`children` Missing. You should wrap at least one component into <KeyboardAccessory />.');
    }

    if (!this.props.show) return null;

    const containerStyle = this.props.noFloat ?
      { backgroundColor, bottom }:
      [styles.container, { backgroundColor, bottom }];

    return (
      <View style={containerStyle}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  }
});
