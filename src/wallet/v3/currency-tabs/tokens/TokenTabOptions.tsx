import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { IconType } from 'react-native-elements';
import { showNotification } from '../../../../../AppMessages';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { WalletStoreType } from '../../../v2/createWalletStore';
import { isConnected as isWalletConnected } from '../../useUniqueOnchain';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BottomSheet,
  BottomSheetButton,
  MenuItem,
} from '../../../../common/components/bottom-sheet';

type PropsType = {
  walletStore: WalletStoreType;
  onchainStore: any;
};

type ItemType = {
  iconName: string;
  iconType: IconType;
  title: string;
  onPress: () => void;
};

const TokenTabOptions = observer((props: PropsType) => {
  const ref = React.useRef<any>();
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const isConnected = isWalletConnected(props.onchainStore);
  const address = props.walletStore.wallet.receiver.address || '';

  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  const show = React.useCallback(() => {
    ref.current?.present();
  }, [ref]);

  const dismissOptions: Array<ItemType> = React.useMemo(() => {
    const actions: Array<ItemType> = [];
    actions.push({
      title: i18n.t('wallet.transferToOnchain'),
      onPress: () => {
        close();
        navigation.navigate('WalletWithdrawal');
      },
      iconName: 'arrow-right',
      iconType: 'material-community',
    });
    actions.push({
      title: i18n.t('buyTokensScreen.title'),
      onPress: () => {
        close();
        navigation.navigate('BuyTokens');
      },
      iconName: 'coins',
      iconType: 'font-awesome-5',
    });
    if (isConnected) {
      actions.push({
        title: i18n.t('copyToClipboard'),
        onPress: () => {
          close();
          Clipboard.setString(address);
          showNotification(i18n.t('wallet.addressCopied'), 'success');
        },
        iconName: 'content-copy',
        iconType: 'material-community',
      });
    }
    return actions;
  }, [address, close, isConnected, navigation]);

  return (
    <>
      <TouchableOpacity style={theme.alignSelfCenter} onPress={show}>
        <Icon size={24} name="dots-vertical" style={theme.colorSecondaryText} />
      </TouchableOpacity>
      <BottomSheet ref={ref}>
        {dismissOptions.map((b, i) => (
          <MenuItem {...b} key={i} />
        ))}
        <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
      </BottomSheet>
    </>
  );
});

export default TokenTabOptions;
