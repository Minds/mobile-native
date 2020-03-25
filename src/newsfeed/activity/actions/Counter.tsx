import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
} from 'react-native';

import { CommonStyle as CS } from '../../../styles/Common';
import abbrev from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

import type {
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

import type { Node } from 'react';

type PropsType = {
  size: number,
  count: number,
  style: TextStyleProp
};

/**
 * Counters
 */
export default class Counter extends PureComponent<PropsType> {

  /**
   * Default Props
   */
  static defaultProps = {
    size: 15,
  };

  /**
   * Render
   */
  render(): Node {

    const {
      size,
      count,
      style,
      ...otherProps
    } = this.props;

    return (
      <View style={[CS.columnAlignCenter]}>
        <Text
          style={[ThemedStyles.style.colorIcon, style, { fontSize: size}]}
          {...otherProps}
        >
          {count > 0 ? abbrev(count,0) : ''}
        </Text>
      </View>
    )
  }
}
