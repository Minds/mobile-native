import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import abbrev from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  textStyles?: TextStyle | TextStyle[];
  secondaryTextStyle?: TextStyle | TextStyle[];
  minds: string;
  mindsPrice: string;
};

export const format = (number: number | string, decimals = true) => {
  const temp: number = typeof number === 'string' ? parseFloat(number) : number;
  let r = '';
  if (temp === 0) {
    r = '0';
  } else if (temp < 1) {
    r = decimals ? temp.toFixed(4) : temp.toFixed(0);
  } else if (temp < 100) {
    r = decimals ? temp.toFixed(2) : temp.toFixed(0);
  } else if (temp < 1000) {
    r = decimals ? temp.toFixed(1) : temp.toFixed(0);
  } else {
    r = abbrev(temp).toString();
  }
  return r;
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
      {format(mindsF)} MINDS{' '}
      <Text style={[styles.cash, theme.colorSecondaryText, secondaryTextStyle]}>
        (${format(cash)})
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
