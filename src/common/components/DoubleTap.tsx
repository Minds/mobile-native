import React from 'react';
import { TouchableProps } from 'react-native-svg';
import { Timeout } from '~/types/Common';

type Props = { onDoubleTap: () => void; onPress?: () => void } & TouchableProps;

/**
 * Double Tap HOC
 *
 * Add the onDoubleTap feature to any component that support the onPress
 *
 * @param {Component} WrappedComponent
 */
const DoubleTap = (Wrapped, delay = 300): any => {
  class DoubleTapCmp extends React.PureComponent<Props> {
    lastTap: number | null = null;
    interval: Timeout | null = null;

    handleOnPress = () => {
      const now = Date.now();
      if (this.lastTap && now - this.lastTap < delay) {
        this.props.onDoubleTap();
        if (this.interval) {
          clearTimeout(this.interval);
        }
      } else {
        this.lastTap = now;
        if (!this.props.onDoubleTap) {
          this.fireOnPress();
        } else if (this.props.onPress) {
          this.interval = setTimeout(() => {
            this.fireOnPress();
          }, delay);
        }
      }
    };

    fireOnPress() {
      if (this.props.onPress) {
        this.props.onPress();
      }
    }

    /**
     * Render
     */
    render() {
      return <Wrapped {...this.props} onPress={this.handleOnPress} />;
    }
  }

  return DoubleTapCmp;
};

export default DoubleTap;
