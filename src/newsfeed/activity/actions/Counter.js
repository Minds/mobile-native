import React, {
  Component
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
          style={[ this.props.orientation != 'column' ? { paddingLeft: 4 } : { paddingLeft: 0}, styles.counter, { fontSize: Math.round(this.props.size * 0.75)}]}
          >
          {this.props.count > 0 ? abbrev(this.props.count,0) : ''}
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
  