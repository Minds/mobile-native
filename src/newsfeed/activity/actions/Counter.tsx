import { ErrorBoundary } from '@sentry/react-native';
import React, { memo } from 'react';
import { View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import MText from '~/common/components/MText';
import abbrev, { abbrevWithUnit } from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  size?: number;
  count: number;
  testID?: string;
  style: any;
};

const Counter = ({ count, style }: PropsType) => {
  const { number: abbrevatedNumber, unit } = abbrevWithUnit(count, 1);
  const [d1, d2] = String(abbrevatedNumber).split('.');
  const fontStyle = [textStyle, style];

  return (
    <ErrorBoundary
      fallback={
        <View style={ThemedStyles.style.columnAlignCenter}>
          <MText style={fontStyle}>{count > 0 ? abbrev(count, 1) : ''}</MText>
        </View>
      }>
      <View style={ThemedStyles.style.rowJustifyCenter}>
        <AnimatedNumbers
          animationDuration={500}
          animateToNumber={Number(d1)}
          fontStyle={fontStyle}
        />
        {Boolean(d2) && (
          <>
            <MText style={fontStyle}>.</MText>
            <AnimatedNumbers
              animationDuration={500}
              animateToNumber={Number(d2)}
              fontStyle={fontStyle}
            />
          </>
        )}

        {Boolean(unit) && <MText style={fontStyle}>{unit}</MText>}
      </View>
    </ErrorBoundary>
  );
};

export default memo(Counter);

const textStyle = ThemedStyles.combine('colorIcon', 'fontM', 'fontMedium');
