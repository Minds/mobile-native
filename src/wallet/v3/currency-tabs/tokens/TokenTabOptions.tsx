import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { IconButton } from '~ui/icons';
import { showNotification } from '../../../../../AppMessages';
import i18n from '../../../../common/services/i18n.service';
import { WalletStoreType } from '../../../v2/createWalletStore';
import { isConnected as isWalletConnected } from '../../useUniqueOnchain';
import {
  BottomSheetModal,
  BottomSheetButton,
  BottomSheetMenuItem,
} from '../../../../common/components/bottom-sheet';
import { ONCHAIN_ENABLED } from '../../../../config/Config';

type PropsType = {
  walletStore: WalletStoreType;
  onchainStore: any;
};

type ItemType = {
  iconName: string;
  iconType: string;
  title: string;
  onPress: () => void;
};

const TokenTabOptions = observer((props: PropsType) => {
  const ref = React.useRef<any>();
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
    ONCHAIN_ENABLED &&
      actions.push({
        title: i18n.t('wallet.transferToOnchain'),
        onPress: () => {
          close();
          navigation.navigate('WalletWithdrawal');
        },
        iconName: 'arrow-right',
        iconType: 'material-community',
      });
    if (isConnected) {
      actions.push({
        title: i18n.t('copyToClipboard'),
        onPress: () => {
          close();
          Clipboard.setStringAsync(address);
          showNotification(i18n.t('wallet.addressCopied'), 'success');
        },
        iconName: 'content-copy',
        iconType: 'material-community',
      });
    }
    return actions;
  }, [address, close, isConnected, navigation]);

  if (dismissOptions.length === 0) {
    return null;
  }

  return (
    <>
      <IconButton left="S" name="more" onPress={show} />
      <BottomSheetModal ref={ref}>
        {dismissOptions.map((b, i) => (
          <BottomSheetMenuItem {...b} key={i} />
        ))}
        <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
      </BottomSheetModal>
    </>
  );
});

export default TokenTabOptions;
