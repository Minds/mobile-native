import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import ErrorBoundary from '~/common/components/ErrorBoundary';
import MText from '~/common/components/MText';
import abbrev, { abbrevWithUnit } from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  size?: number;
  count: number;
  testID?: string;
  style?: any;
};

const Counter = ({ count, style }: PropsType) => {
  const { number: abbrevatedNumber, unit } = abbrevWithUnit(count, 1);
  const [d1, d2] = String(abbrevatedNumber).split('.');
  const fontStyle = [textStyle, style];
  const [animationDuration, setAnimationDuration] = useState(0);

  // set the animation duration after component mounts
  // to disable the initial animation
  useEffect(() => {
    setAnimationDuration(500);
  }, []);

  return (
    <ErrorBoundary
      fallback={
        <View style={ThemedStyles.style.columnAlignCenter}>
          <MText style={fontStyle}>{count > 0 ? abbrev(count, 1) : ''}</MText>
        </View>
      }>
      <View style={ThemedStyles.style.rowJustifyCenter}>
        <AnimatedNumbers
          animationDuration={animationDuration}
          animateToNumber={Number(d1)}
          fontStyle={fontStyle}
        />
        {Boolean(d2) && (
          <>
            <MText style={fontStyle}>.</MText>
            <AnimatedNumbers
              animationDuration={animationDuration}
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

export default Counter;

const textStyle = ThemedStyles.combine('colorIcon', 'fontM', 'fontMedium');
