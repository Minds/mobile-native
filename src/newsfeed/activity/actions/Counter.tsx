import React, { memo } from 'react';
import { View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import MText from '~/common/components/MText';
import { abbrevWithUnit } from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  size?: number;
  count: number;
  testID?: string;
};

const Counter = ({ count }: PropsType) => {
  const { number: abbrevatedNumber, unit } = abbrevWithUnit(count, 1);
  const [d1, d2] = String(abbrevatedNumber).split('.');

  return (
    <View style={ThemedStyles.style.rowJustifyCenter}>
      <AnimatedNumbers
        animationDuration={500}
        animateToNumber={Number(d1)}
        fontStyle={textStyle}
      />
      {Boolean(d2) && (
        <>
          <MText style={textStyle}>.</MText>
          <AnimatedNumbers
            animationDuration={500}
            animateToNumber={Number(d2)}
            fontStyle={textStyle}
          />
        </>
      )}

      {Boolean(unit) && <MText style={textStyle}>{unit}</MText>}
    </View>
  );
};

export default memo(Counter);

const textStyle = ThemedStyles.combine('colorIcon', 'fontM', 'fontMedium');
