import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import abbrev from '../../../common/helpers/abbrev';
import ThemedStyles from '../../../styles/ThemedStyles';
import { EarningsCurrencyType } from '../../v2/createWalletStore';

type PropsType = {
  textStyles?: TextStyle | TextStyle[];
  secondaryTextStyle?: TextStyle | TextStyle[];
  value: string;
  mindsPrice: string;
  currencyType?: EarningsCurrencyType;
  cashAsPrimary?: boolean;
};

export const format = (number: number | string, decimals = true) => {
  let temp: number = typeof number === 'string' ? parseFloat(number) : number;
  const isNegative = temp < 0;
  temp = Math.abs(temp);
  let r = '';
  if (temp === 0) {
    r = '0';
  } else if (temp < 1) {
    r = temp.toLocaleString(undefined, {
      maximumFractionDigits: decimals ? 4 : 0,
    });
  } else if (temp < 100) {
    r = temp.toLocaleString(undefined, {
      maximumFractionDigits: decimals ? 2 : 0,
    });
  } else if (temp < 1000) {
    r = temp.toLocaleString(undefined, {
      maximumFractionDigits: decimals ? 1 : 0,
    });
  } else if (temp < 1000000) {
    r = temp.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  } else {
    r = abbrev(temp).toString();
  }
  return isNegative ? `-${r}` : r;
};

const MindsTokens = ({
  textStyles,
  secondaryTextStyle,
  value,
  mindsPrice,
  currencyType,
  cashAsPrimary,
}: PropsType) => {
  const isTokens = !currencyType || currencyType === 'tokens';
  const theme = ThemedStyles.style;
  const mindsPriceF = parseFloat(mindsPrice);
  const mindsF = parseFloat(value);
  const cash = isTokens ? mindsPriceF * mindsF : mindsF;
  return (
    <Text style={[styles.minds, textStyles]}>
      {isTokens ? '' : '$'}
      {format(mindsF)}
      {isTokens ? (
        <Text style={[theme.colorSecondaryText, secondaryTextStyle]}>
          {' '}
          MINDS{' '}
        </Text>
      ) : (
        ''
      )}
      {isTokens && (
        <Text
          style={[
            styles.cash,
            theme.colorSecondaryText,
            cashAsPrimary ? textStyles : secondaryTextStyle,
          ]}>
          · ${format(cash)}
        </Text>
      )}
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
