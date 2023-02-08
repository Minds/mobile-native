import React, { useCallback } from 'react';
import { Alert, View } from 'react-native';
import { B1, B2, H3, Spacer } from '~ui';
import MenuItem from '../../../common/components/menus/MenuItem';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import {
  WalletScreenNavigationProp,
  WalletScreenRouteProp,
} from '../../v3/WalletScreen';
import { WalletStoreType } from '../createWalletStore';
import StripeConnectButton from '../stripe-connect/StripeConnectButton';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  walletStore: WalletStoreType;
  route: WalletScreenRouteProp;
};

const UsdSettings = ({ walletStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const hasBankInfo =
    walletStore.wallet.cash.address !== null &&
    walletStore.wallet.cash.address !== '';

  const confirm = useCallback(() => {
    Alert.alert(
      i18n.t('wallet.usd.leaveButton'),
      i18n.t('wallet.usd.confirmLeave'),
      [
        { text: i18n.t('no'), style: 'cancel' },
        {
          text: i18n.t('wallet.usd.sure'),
          onPress: () => walletStore.leaveMonetization(),
        },
      ],
    );
  }, [walletStore]);

  return (
    <Spacer top="M">
      <Spacer horizontal="L">
        <H3 bottom="S">{i18n.t('wallet.usd.bankInfo')}</H3>
        {!hasBankInfo && (
          <View style={theme.marginBottom7x}>
            <B1 color="secondary">
              {i18n.t('wallet.usd.bankInfoDescription')}
            </B1>
            <Spacer top="XXL">
              <StripeConnectButton />
            </Spacer>
          </View>
        )}
      </Spacer>
      {hasBankInfo && (
        <Spacer bottom="XL2">
          <StripeConnectButton />
        </Spacer>
      )}
      {hasBankInfo && (
        <>
          <Spacer horizontal="M" bottom="M">
            <H3 bottom="XS">{i18n.t('wallet.usd.leave')}</H3>
            <B2 color="secondary">{i18n.t('wallet.usd.leaveDescription')}</B2>
          </Spacer>
          <MenuItem
            title={i18n.t('wallet.usd.leaveButton')}
            onPress={confirm}
          />
        </>
      )}
    </Spacer>
  );
};

export default UsdSettings;
