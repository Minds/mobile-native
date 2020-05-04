import React, { PureComponent } from 'react';
import { debounce } from 'lodash';

interface OnPressType {
  onPress: Function;
}

/**
 * Debounce Tap HOC
 * @param {Component} WrappedComponent
 */
export default function preventDoubleTap<T>(Wrapped: React.ComponentType<T>) {
  const displayName = Wrapped.displayName || Wrapped.name || 'Component';

  return class PreventDoubleTap extends PureComponent<T & OnPressType> {
    public static displayName = `preventDoubleTap(${displayName})`;

    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    };

    onPress = debounce(this.debouncedOnPress, 300, {
      leading: true,
      trailing: false,
    });

    /**
     * Render
     */
    render() {
      return <Wrapped {...this.props} onPress={this.onPress} />;
    }
  };
}
