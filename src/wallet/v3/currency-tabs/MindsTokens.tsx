import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import number from '~/common/helpers/number';
import abbrev from '../../../common/helpers/abbrev';
import { EarningsCurrencyType } from '../../v2/createWalletStore';
import { B2, Row } from '~ui';

type PropsType = {
  containerStyle?: ViewStyle | ViewStyle[];
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
  value,
  currencyType,
  // cashAsPrimary,
  // mindsPrice,
  containerStyle,
}: PropsType) => {
  const isTokens = !currencyType || currencyType === 'tokens';
  // const mindsPriceF = parseFloat(mindsPrice);
  const mindsF = parseFloat(value);
  // const cash = isTokens ? mindsPriceF * mindsF : mindsF;

  const text: any = [];
  const mindsFNumber = number(mindsF, 0, 2);

  if (!isTokens) {
    text.push(
      <B2 key={'cash1'} font="medium" flat>
        ${mindsFNumber}
      </B2>,
    );
  } else {
    text.push(
      <B2 key={'token1'} font="medium" flat>
        {mindsFNumber}
      </B2>,
    );
  }

  if (isTokens) {
    text.push(
      <B2 key={'token2'} flat font="medium">
        {' '}
      </B2>,
    );
    text.push(
      <B2 key={'token3'} flat color="secondary" font="medium">
        tokens
      </B2>,
    );

    // disable token price #5560
    // text.push(
    //   <B2 key={'token4'} flat color="secondary" font="bold">
    //     {' · '}
    //   </B2>,
    // );
    // text.push(
    //   <B2
    //     key={'token5'}
    //     flat
    //     color={cashAsPrimary ? 'primary' : 'secondary'}
    //     font="medium">
    //     ${number(cash, 0, 2)}
    //   </B2>,
    // );
  }
  return (
    <Row containerStyle={containerStyle} align="baseline">
      {text}
    </Row>
  );
};

export default MindsTokens;
