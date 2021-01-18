import React from 'react';
import { ScrollView, Text } from 'react-native';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import Button from '../common/components/Button';
import ThemedStyles from '../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';
import { getConnector } from '../blockchain/services/WalletConnectService';

type Store = {
  web3: Web3 | null;
  provider: WalletConnectProvider | null;
  connected: boolean;
  chainId: number | null;
  accounts: string[] | null;
  address: string | null;
  setWeb3: (newValue: Store['web3']) => void;
  setProvider: (newValue: Store['provider']) => void;
  setConnected: (newValue: Store['connected']) => void;
  setChainId: (newValue: Store['chainId']) => void;
  setAccounts: (newValue: Store['accounts']) => void;
  setAddress: (newValue: Store['address']) => void;
  resetConnection: () => void;
};

export default observer(() => {
  const theme = ThemedStyles.style;
  const store = useLocalStore<Store>(createStore);

  const startConnection = async () => {
    try {
      const provider = await getConnector();
      const web3 = new Web3(provider as any);
      store.setWeb3(web3);
      store.setProvider(provider);
      store.setConnected(true);
      store.setAccounts(provider.accounts);
      store.setAddress(provider.accounts[0]);
      store.setChainId(provider.chainId);
    } catch (error) {
      console.log('error =>', error);
    }
  };

  return (
    <ScrollView
      style={[theme.flexContainer, theme.backgroundPrimary]}
      contentContainerStyle={theme.paddingBottom4x}>
      {store.connected ? (
        <>
          <Text>Connected</Text>
          <Text>{`Accounts: ${JSON.stringify(store.accounts)}`}</Text>
          <Text>{`Chain ID: ${JSON.stringify(store.chainId)}`}</Text>
          <Text>{`Address: ${JSON.stringify(store.address)}`}</Text>
          <Button onPress={store.resetConnection} text="Disconnect" />
        </>
      ) : (
        <Button
          onPress={startConnection}
          text="Connect"
          containerStyle={[
            theme.transparentButton,
            theme.paddingVertical3x,
            theme.fullWidth,
            theme.marginTop,
            theme.borderPrimary,
          ]}
          textStyle={theme.buttonText}
        />
      )}
    </ScrollView>
  );
});

const createStore = (): Store => ({
  web3: null,
  provider: null,
  connected: false,
  chainId: null,
  accounts: null,
  address: null,
  setWeb3(newValue: Store['web3']) {
    this.web3 = newValue;
  },
  setProvider(newValue: Store['provider']) {
    this.provider = newValue;
  },
  setConnected(newValue: Store['connected']) {
    this.connected = newValue;
  },
  setChainId(newValue: Store['chainId']) {
    this.chainId = newValue;
  },
  setAccounts(newValue: Store['accounts']) {
    this.accounts = newValue;
  },
  setAddress(newValue: Store['address']) {
    this.address = newValue;
  },
  resetConnection() {
    this.setConnected(false);
    this.setProvider(null);
    this.setChainId(null);
    this.setAccounts(null);
    this.setAddress(null);
  },
});
