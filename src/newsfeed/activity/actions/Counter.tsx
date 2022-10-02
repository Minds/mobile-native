import React from 'react';
import { View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import ErrorBoundary from '~/common/components/ErrorBoundary';
import MText from '~/common/components/MText';
import abbrev, { abbrevWithUnit } from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

const AnimationDuration = 500;

export type CounterPropsType = {
  size?: number;
  count: number;
  testID?: string;
  spaced?: boolean;
  animated?: boolean;
  style?: any;
};

const Counter = ({
  count,
  style,
  spaced,
  animated = true,
}: CounterPropsType) => {
  const theme = ThemedStyles.style;
  const { number: abbrevatedNumber, unit } = abbrevWithUnit(count, 1);
  const [d1, d2] = String(abbrevatedNumber).split('.');
  const fontStyle = [textStyle, style];

  if (animated) {
    return (
      <ErrorBoundary
        fallback={
          <View style={theme.columnAlignCenter}>
            <MText style={fontStyle}>{count > 0 ? abbrev(count, 1) : ''}</MText>
          </View>
        }>
        <View
          style={[theme.rowJustifyCenter, spaced ? theme.marginLeftXS : null]}>
          {count > 0 && (
            <>
              <AnimatedNumbers
                animationDuration={AnimationDuration}
                animateToNumber={Number(d1)}
                fontStyle={fontStyle}
              />
              {Boolean(d2) && (
                <>
                  <MText style={fontStyle}>.</MText>
                  <AnimatedNumbers
                    animationDuration={AnimationDuration}
                    animateToNumber={Number(d2)}
                    fontStyle={fontStyle}
                  />
                </>
              )}
            </>
          )}

          {Boolean(unit) && <MText style={fontStyle}>{unit}</MText>}
        </View>
      </ErrorBoundary>
    );
  } else {
    return (
      <View
        style={[theme.rowJustifyCenter, spaced ? theme.marginLeftXS : null]}>
        <MText style={fontStyle}>{count > 0 ? abbrev(count, 1) : ''}</MText>
      </View>
    );
  }
};

export default Counter;

const textStyle = ThemedStyles.combine('colorIcon', 'fontM', 'fontMedium');
