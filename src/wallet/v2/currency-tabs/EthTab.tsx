import React, { useCallback } from 'react';
import { View } from 'react-native';
import type { WalletStoreType } from '../createWalletStore';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import MText from '../../../common/components/MText';

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
      <MText style={[theme.fontXXL, theme.paddingTop3x, theme.fontMedium]}>
        {i18n.t('wallet.eth.title')}
      </MText>
      <MText style={[theme.fontL, theme.paddingTop2x]}>
        {i18n.t('wallet.eth.description')}
      </MText>
      <MText style={[theme.fontL, theme.paddingTop2x]}>
        {i18n.t('wallet.eth.toChange')}{' '}
        <MText style={theme.colorLink} onPress={onPress}>
          {i18n.t('wallet.eth.tokenSettings')}
        </MText>
      </MText>
    </View>
  );
};

export default EthTab;
