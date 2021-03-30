import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { showNotification } from '../../../AppMessages';
import {
  getExportableWallets,
  exportPrivate,
  fetchPrivateKeyFromStorage,
  setWallets,
} from '../../blockchain/ExportOldWallet';
import Button from '../../common/components/Button';
import Selector from '../../common/components/Selector';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

const getWalletLabel = (wallet: any) => (
  <View style={ThemedStyles.style.borderBottomHair}>
    <Text style={[ThemedStyles.style.fontXL, ThemedStyles.style.centered]}>
      {wallet.address.substr(0, 25)}...
    </Text>
  </View>
);

const keyExtractor = (wallet: any) => wallet.address;

export default observer(function ExportLegacyWallet() {
  const theme = ThemedStyles.style;
  const selectorRef = React.useRef<Selector>(null);
  const store = useLocalStore(() => ({
    wallets: [] as Array<any>,
    password: '',
    async load() {
      store.wallets = await getExportableWallets();
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
      <Text style={[theme.fontXXL, theme.textCenter, theme.marginBottom6x]}>
        {i18n.t('blockchain.exportLegacy1')}
      </Text>
      <Text style={[theme.fontL, theme.textCenter, theme.marginBottom6x]}>
        {i18n.t('blockchain.exportLegacy2')}
      </Text>
      <Text>Keychain Password</Text>
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
      <Button text={'Export'} onPress={() => selectorRef.current?.show()} />
    </View>
  );
});
