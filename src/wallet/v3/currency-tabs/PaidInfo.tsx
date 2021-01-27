import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';

const PaidInfo = () => {
  const theme = ThemedStyles.style;
  const unpaidEarnings = '95.00';
  const monthPaidOuts = [
    {
      month: 'December 2020',
      total: 35,
    },
    {
      month: 'November 2020',
      total: 35,
    },
    {
      month: 'October 2020',
      total: 35,
    },
  ];
  let totalPaidOuts = 0;
  const allTimeEarnings = '195.00';
  const viewPadding = [theme.paddingLeft3x, theme.paddingTop3x];
  const titleStyle = [
    theme.colorSecondaryText,
    theme.fontL,
    theme.marginBottom,
  ];
  const earningStyle = [theme.bold, theme.fontLM, theme.marginBottom3x];
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={viewPadding}>
          <Text style={titleStyle}>{i18n.t('wallet.unpaidEarnings')}</Text>
          <Text style={earningStyle}>${unpaidEarnings}</Text>
          {monthPaidOuts.map((paidOut) => {
            totalPaidOuts += paidOut.total;
            return (
              <View style={[theme.rowStretch, theme.marginBottom]}>
                <Text style={[styles.month, theme.colorSecondaryText]}>
                  {paidOut.month}
                </Text>
                <Text style={[styles.month, theme.flexContainer]}>
                  ${paidOut.total}
                </Text>
              </View>
            );
          })}
        </View>
        <View
          style={[
            theme.borderPrimary,
            theme.borderTop,
            theme.marginTop3x,
            ...viewPadding,
          ]}>
          <Text style={titleStyle}>{i18n.t('wallet.totalPaidout')}</Text>
          <Text style={earningStyle}>${totalPaidOuts}</Text>

          <Text style={titleStyle}>{i18n.t('wallet.alltime')}</Text>
          <Text style={earningStyle}>${allTimeEarnings}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
    width: '100%',
  },
  month: {
    flex: 3,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
});

export default PaidInfo;
