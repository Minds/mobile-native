import {debounce} from 'lodash';
import React, { PureComponent } from 'react';

/**
 * Debounce Tap HOC
 * @param {Component} WrappedComponent
 */
export default (Wrapped) => {

  class PreventDoubleTap extends PureComponent {

    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    }

    onPress = debounce(this.debouncedOnPress, 300, { leading: true, trailing: false });

    /**
     * Render
     */
    render() {
      return <Wrapped {...this.props} onPress={this.onPress} />;
    }
  }

  return PreventDoubleTap;
}