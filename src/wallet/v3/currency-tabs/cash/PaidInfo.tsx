import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MText from '../../../../common/components/MText';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { WalletStoreType } from '../../../v2/createWalletStore';

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
          <MText style={titleStyle}>{i18n.t('wallet.unpaidEarnings')}</MText>
          <MText style={earningStyle}>${unpaidEarnings}</MText>
        </View>
        <View
          style={[
            theme.bcolorPrimaryBorder,
            theme.borderTop,
            theme.marginTop3x,
            ...viewPadding,
          ]}>
          <MText style={titleStyle}>{i18n.t('wallet.totalPaidout')}</MText>
          <MText style={earningStyle}>${totalPaidOuts}</MText>

          <MText style={titleStyle}>{i18n.t('wallet.alltime')}</MText>
          <MText style={earningStyle}>${allTimeEarnings}</MText>
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
    fontFamily: 'Roboto_500Medium',
  },
});

export default PaidInfo;
