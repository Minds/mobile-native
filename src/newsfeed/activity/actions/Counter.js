import React, {
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import { CommonStyle } from '../../../styles/Common';

import abbrev from '../../../common/helpers/abbrev';

/**
 * Counters
 */
export default class Counter extends PureComponent {

  /**
   * Default Props
   */
  static defaultProps = {
    size: 15,
  };

  /**
   * Render
   */
  render() {

    const {
      orientation,
      size,
      count,
      ...otherProps
    } = this.props;

    return (
      <View style={styles.counterContainer}>
        <Text
          style={[ orientation != 'column' ? { paddingLeft: 4 } : { paddingLeft: 0}, styles.counter, { fontSize: Math.round(size * 0.75)}]}
          {...otherProps}
        >
          {count > 0 ? abbrev(count,0) : ''}
        </Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    color: '#888',
    fontWeight: '800',
  },
});
