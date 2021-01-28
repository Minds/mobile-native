import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  textStyles?: TextStyle | TextStyle[];
  secondaryTextStyle?: TextStyle | TextStyle[];
  minds: string;
  mindsPrice: string;
};

const MindsTokens = ({
  textStyles,
  secondaryTextStyle,
  minds,
  mindsPrice,
}: PropsType) => {
  const theme = ThemedStyles.style;
  const mindsPriceF = parseFloat(mindsPrice);
  const mindsF = parseFloat(minds);
  const cash = mindsPriceF * mindsF;
  return (
    <Text style={[styles.minds, textStyles]}>
      {mindsF.toFixed(4)} MINDS{' '}
      <Text style={[styles.cash, theme.colorSecondaryText, secondaryTextStyle]}>
        (${cash.toFixed(4)})
      </Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  minds: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
  cash: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
});

export default MindsTokens;
