import React from 'react';
import Button from '../../../../common/components/Button';
import i18n from '../../../../common/services/i18n.service';
import { WalletStoreType } from '../../../v2/createWalletStore';
import { B2, Icon } from '~ui';

type PropsType = {
  walletStore: WalletStoreType;
  navigation: any;
};

const ConnectBankButton = ({ walletStore, navigation }: PropsType) => {
  const isConnected = walletStore.stripeDetails.hasBank;
  const navToBankScreen = () =>
    navigation.push('BankInfoScreen', { walletStore });
  const buttonChildren = isConnected ? (
    <B2 font="medium" color="secondary">
      {walletStore.wallet.cash.label}
    </B2>
  ) : (
    <>
      <B2 font="medium" color="secondary">
        {i18n.t('onboarding.connectBank')}{' '}
      </B2>
      <Icon name="plus-circle" size="tiny" />
    </>
  );

  return (
    <Button xSmall onPress={!isConnected ? navToBankScreen : undefined}>
      {buttonChildren}
    </Button>
  );
};

export default ConnectBankButton;
