import React from 'react';
import { View } from 'react-native';
import MText from '~/common/components/MText';
import abbrev from '../../../common/helpers/abbrev';
import sp from '~/services/serviceProvider';

export type CounterPropsType = {
  size?: number;
  count: number;
  testID?: string;
  spaced?: boolean;
  animated?: boolean;
  style?: any;
};

const Counter = ({ count, style, spaced }: CounterPropsType) => {
  const theme = sp.styles.style;
  const fontStyle = [textStyle, style];

  return (
    <View style={[theme.rowJustifyCenter, spaced ? theme.marginLeftXS : null]}>
      <MText style={fontStyle}>{count > 0 ? abbrev(count, 1) : ''}</MText>
    </View>
  );
};

export default Counter;

const textStyle = sp.styles.combine('colorIcon', 'fontM', 'fontMedium');
