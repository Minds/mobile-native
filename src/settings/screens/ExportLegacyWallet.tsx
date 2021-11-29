import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import { showNotification } from '../../../AppMessages';
import {
  getExportableWallets,
  exportPrivate,
  fetchPrivateKeyFromStorage,
  setWallets,
} from '../../blockchain/ExportOldWallet';
import MText from '../../common/components/MText';
import Selector from '../../common/components/SelectorV2';
import TextInput from '../../common/components/TextInput';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Button } from '~ui';

const getWalletLabel = (wallet: any) => (
  <View style={ThemedStyles.style.borderBottomHair}>
    <MText style={[ThemedStyles.style.fontXL, ThemedStyles.style.centered]}>
      {wallet.address.substr(0, 25)}...
    </MText>
  </View>
);

const keyExtractor = (wallet: any) => wallet.address;

export default observer(function ExportLegacyWallet() {
  const theme = ThemedStyles.style;
  const selectorRef = React.useRef<any>(null);
  const store = useLocalStore(() => ({
    wallets: [] as Array<any>,
    password: '',
    async load() {
      store.wallets = await getExportableWallets(true);
    },
    setPassword(v) {
      store.password = v;
    },
    async selected(w) {
      selectorRef.current?.close();
      try {
        const privateKey = await fetchPrivateKeyFromStorage(
          w.address,
          store.password,
        );
        exportPrivate(privateKey);
        w.exported = true;
        setWallets(store.wallets.slice());
      } catch (error) {
        console.log(error);
        showNotification(i18n.t('settings.invalidPassword'));
      }
    },
  }));

  React.useEffect(() => {
    store.load();
  }, [store]);

  return (
    <View style={[theme.flexContainer, theme.padding4x]}>
      <MText style={[theme.fontXXL, theme.textCenter, theme.marginBottom6x]}>
        {i18n.t('blockchain.exportLegacy1')}
      </MText>
      <MText style={[theme.fontL, theme.textCenter, theme.marginBottom6x]}>
        {i18n.t('blockchain.exportLegacy2')}
      </MText>
      <MText>Keychain Password</MText>
      <TextInput
        style={[theme.input, theme.marginBottom6x]}
        value={store.password}
        onChangeText={store.setPassword}
        secureTextEntry={true}
      />
      <Selector
        ref={selectorRef}
        onItemSelect={store.selected}
        data={store.wallets}
        valueExtractor={getWalletLabel}
        keyExtractor={keyExtractor}
        backdropOpacity={0.95}
      />
      <Button
        disabled={!store.password}
        onPress={() => selectorRef.current?.show()}>
        Export
      </Button>
    </View>
  );
});
