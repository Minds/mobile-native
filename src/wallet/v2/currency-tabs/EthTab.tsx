import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import type { WalletStoreType } from '../createWalletStore';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  walletStore: WalletStoreType;
};

const EthTab = ({ walletStore }: PropsType) => {
  const theme = ThemedStyles.style;

  const onPress = useCallback(() => {
    walletStore.setCurrent('tokens', 'settings');
  }, [walletStore]);

  return (
    <View style={theme.paddingHorizontal4x}>
      <Text style={[theme.fontXXL, theme.paddingTop3x, theme.fontMedium]}>
        {i18n.t('wallet.eth.title')}
      </Text>
      <Text style={[theme.fontL, theme.paddingTop2x]}>
        {i18n.t('wallet.eth.description')}
      </Text>
      <Text style={[theme.fontL, theme.paddingTop2x]}>
        {i18n.t('wallet.eth.toChange')}{' '}
        <Text style={theme.colorLink} onPress={onPress}>
          {i18n.t('wallet.eth.tokenSettings')}
        </Text>
      </Text>
    </View>
  );
};

export default EthTab;
