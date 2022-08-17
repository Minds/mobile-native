import React, { PureComponent } from 'react';
import { View } from 'react-native';
import MText from '../../../common/components/MText';

import abbrev from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  size?: number;
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
  };

  /**
   * Render
   */
  render(): React.ReactNode {
    const { count, ...otherProps } = this.props;

    return (
      <View style={ThemedStyles.style.columnAlignCenter}>
        <MText style={textStyle} {...otherProps}>
          {count > 0 ? abbrev(count, 1) : ''}
        </MText>
      </View>
    );
  }
}

const textStyle = ThemedStyles.combine('colorIcon', 'fontM', 'fontMedium');
