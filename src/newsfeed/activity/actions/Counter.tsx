import React, { PureComponent } from 'react';

import { Text, View } from 'react-native';

import abbrev from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  size: number;
  count: number;
  testID?: string;
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
    style: undefined,
  };

  /**
   * Render
   */
  render(): React.ReactNode {
    const { count, ...otherProps } = this.props;

    return (
      <View style={ThemedStyles.style.columnAlignCenter}>
        <Text style={textStyle} {...otherProps}>
          {count > 0 ? abbrev(count, 0) : ''}
        </Text>
      </View>
    );
  }
}

const textStyle = ThemedStyles.combine('colorIcon', 'fontL', 'fontMedium');
