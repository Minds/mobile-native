import React, { PureComponent } from 'react';

import { Text, View, TextStyle } from 'react-native';

import { CommonStyle as CS } from '../../../styles/Common';
import abbrev from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  size: number;
  count: number;
  testID?: string;
  style: TextStyle;
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
    const theme = ThemedStyles.style;
    const { count, style, ...otherProps } = this.props;

    return (
      <View style={CS.columnAlignCenter}>
        <Text
          style={[theme.colorIcon, theme.fontL, theme.fontMedium, style]}
          {...otherProps}>
          {count > 0 ? abbrev(count, 0) : ''}
        </Text>
      </View>
    );
  }
}
