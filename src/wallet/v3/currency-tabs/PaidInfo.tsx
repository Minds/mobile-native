import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { WalletStoreType } from '../../v2/createWalletStore';

type PropsType = {
  walletStore: WalletStoreType;
};

const PaidInfo = ({ walletStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const unpaidEarnings = walletStore.stripeDetails.pendingBalanceSplit;
  const totalPaidOuts = walletStore.stripeDetails.totalPaidOutSplit;
  const allTimeEarnings = unpaidEarnings + totalPaidOuts;
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
