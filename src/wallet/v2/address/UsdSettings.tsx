import React, { useCallback } from 'react';
import {
  WalletScreenNavigationProp,
  WalletScreenRouteProp,
} from '../../v3/WalletScreen';
import { View, Alert } from 'react-native';
import { WalletStoreType } from '../createWalletStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import MenuItem from '../../../common/components/menus/MenuItem';
import i18n from '../../../common/services/i18n.service';
import Button from '../../../common/components/Button';
import { H3, B2, B1, Spacer } from '~ui';
import StripeConnectButton from '../stripe-connect/StripeConnectButton';
import { useFeature } from '@growthbook/growthbook-react';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  walletStore: WalletStoreType;
  route: WalletScreenRouteProp;
};

const UsdSettings = ({ walletStore, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const hasBankInfo =
    walletStore.wallet.cash.address !== null &&
    walletStore.wallet.cash.address !== '';
  const stripeConnectExperimentOn = useFeature('mob-stripe-connect-4587').on;
  const hasBankAccount = walletStore.stripeDetails.hasBank;

  const navToBankScreen = () =>
    navigation.push('BankInfoScreen', { walletStore });

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
              {stripeConnectExperimentOn ? (
                <StripeConnectButton />
              ) : (
                <Button
                  onPress={navToBankScreen}
                  text={i18n.t('wallet.usd.add')}
                />
              )}
            </Spacer>
          </View>
        )}
      </Spacer>
      {hasBankInfo && (
        <Spacer bottom="XL2">
          {stripeConnectExperimentOn ? (
            <StripeConnectButton />
          ) : (
            <MenuItem
              title={
                hasBankAccount
                  ? walletStore.wallet.cash.label
                  : i18n.t('wallet.bank.complete')
              }
              onPress={navToBankScreen}
            />
          )}
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
