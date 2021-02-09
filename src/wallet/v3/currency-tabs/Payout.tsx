import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import MindsTokens from './MindsTokens';

type PropsType = {
  minds: string;
  mindsPrice: string;
  isToday: boolean;
};

const Payout = ({ minds, mindsPrice, isToday }: PropsType) => {
  const theme = ThemedStyles.style;

  const payout = isToday ? (
    <View style={[styles.container, theme.borderPrimary]}>
      <View style={theme.flexContainer}>
        <Text style={styles.text}>{i18n.t('wallet.todayEstimate')}</Text>
        {/*<Text style={[theme.colorSecondaryText, theme.fontL]}>
          {i18n.t('wallet.payout')} 6 hrs 15 mins
        </Text>*/}
      </View>
      <MindsTokens
        value={minds}
        mindsPrice={mindsPrice}
        textStyles={[theme.centered, theme.flexContainer]}
      />
    </View>
  ) : (
    <View style={[styles.container, theme.borderPrimary]}>
      <Text style={[styles.text, theme.flexContainer]}>
        {i18n.t('wallet.usd.earnings')}
      </Text>
      <MindsTokens
        value={minds}
        mindsPrice={mindsPrice}
        textStyles={theme.flexContainer}
      />
    </View>
  );

  return payout;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    marginTop: 20,
  },
  text: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
});

export default Payout;
