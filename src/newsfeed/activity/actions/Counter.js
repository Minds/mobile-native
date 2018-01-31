import React, {
  Component
} from 'react';

import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import { CommonStyle } from '../../../styles/Common';

/**
 * Counters
 */
export default class Counter extends Component {

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
    return (
      <View style={styles.counterContainer}>
        <Text
          style={[styles.counter, { fontSize: Math.round(this.props.size * 0.75)}]}
          >
          {this.props.count > 0 ? this.props.count : ''}
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
    paddingLeft: 8,
  },
});
  