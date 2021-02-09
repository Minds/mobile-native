import React from 'react';
import { Text } from 'react-native';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WalletStoreType } from '../../v2/createWalletStore';

type PropsType = {
  walletStore: WalletStoreType;
  navigation: any;
};

const ConnectBankButton = ({ walletStore, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const isConnected = walletStore.stripeDetails.hasBank;
  const navToBankScreen = () =>
    navigation.push('BankInfoScreen', { walletStore });
  const buttonChildren = isConnected ? (
    <Text style={[theme.colorSecondaryText, theme.fontL]}>
      {walletStore.wallet.cash.label}
    </Text>
  ) : (
    <>
      <Text style={theme.fontL}>{i18n.t('onboarding.connectBank')}</Text>
      <Icon
        name="plus-circle"
        size={16}
        color={ThemedStyles.getColor('primary_text')}
        style={theme.marginLeft2x}
      />
    </>
  );

  return (
    <Button xSmall onPress={!isConnected ? navToBankScreen : undefined}>
      {buttonChildren}
    </Button>
  );
};

export default ConnectBankButton;
