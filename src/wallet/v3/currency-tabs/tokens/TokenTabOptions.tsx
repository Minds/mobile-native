import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showNotification } from '../../../../../AppMessages';
import BottomButtonOptions, {
  ItemType,
} from '../../../../common/components/BottomButtonOptions';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { WalletStoreType } from '../../../v2/createWalletStore';
import { isConnected as isWalletConnected } from '../../useUniqueOnchain';

type PropsType = {
  walletStore: WalletStoreType;
  onchainStore: any;
};

const TokenTabOptions = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const isConnected = isWalletConnected(props.onchainStore);
  const address = props.walletStore.wallet.receiver.address || '';
  const localStore = useLocalStore(() => ({
    showMenu: false,
    show() {
      localStore.showMenu = true;
    },
    hide() {
      localStore.showMenu = false;
    },
  }));

  const dismissOptions: Array<Array<ItemType>> = React.useMemo(() => {
    const actions: Array<Array<ItemType>> = [[]];
    actions[0].push({
      title: i18n.t('wallet.transferToOnchain'),
      onPress: () => {
        localStore.hide();
        navigation.navigate('WalletWithdrawal');
      },
    });
    actions[0].push({
      title: i18n.t('buyTokensScreen.title'),
      onPress: () => {
        localStore.hide();
        navigation.navigate('BuyTokens');
      },
    });
    if (isConnected) {
      actions[0].push({
        title: i18n.t('copyToClipboard'),
        onPress: () => {
          localStore.hide();
          Clipboard.setString(address);
          showNotification(i18n.t('wallet.addressCopied'), 'success');
        },
      });
    }
    actions.push([
      {
        title: i18n.t('cancel'),
        titleStyle: theme.colorSecondaryText,
        onPress: localStore.hide,
      },
    ]);
    return actions;
  }, [address, isConnected, localStore, navigation, theme.colorSecondaryText]);

  return (
    <TouchableOpacity style={theme.alignSelfCenter} onPress={localStore.show}>
      <Icon size={24} name="dots-vertical" style={theme.colorSecondaryText} />
      <BottomButtonOptions
        list={dismissOptions}
        isVisible={localStore.showMenu}
        onPressClose={localStore.hide}
      />
    </TouchableOpacity>
  );
});

export default TokenTabOptions;
