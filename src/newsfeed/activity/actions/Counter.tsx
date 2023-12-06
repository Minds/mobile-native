import React from 'react';
import { View } from 'react-native';
import MText from '~/common/components/MText';
import abbrev from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

export type CounterPropsType = {
  size?: number;
  count: number;
  testID?: string;
  spaced?: boolean;
  animated?: boolean;
  style?: any;
};

const Counter = ({ count, style, spaced }: CounterPropsType) => {
  const theme = ThemedStyles.style;
  const fontStyle = [textStyle, style];

  return (
    <View style={[theme.rowJustifyCenter, spaced ? theme.marginLeftXS : null]}>
      <MText style={fontStyle}>{count > 0 ? abbrev(count, 1) : ''}</MText>
    </View>
  );
};

export default Counter;

const textStyle = ThemedStyles.combine('colorIcon', 'fontM', 'fontMedium');
