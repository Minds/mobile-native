import React from 'react';
import { ScrollView, Text, View } from 'react-native';
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
  formattedResult: Record<string, any> | null;
  setWeb3: (newValue: Store['web3']) => void;
  setProvider: (newValue: Store['provider']) => void;
  setConnected: (newValue: Store['connected']) => void;
  setFormattedResult: (newValue: Store['formattedResult']) => void;
  setChainId: (newValue: Store['chainId']) => void;
  setAccounts: (newValue: Store['accounts']) => void;
  setAddress: (newValue: Store['address']) => void;
  sendTestTransaction: () => Promise<void>;
  signTestMessage: () => Promise<void>;
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
      {store.connected && store.web3 ? (
        <>
          <View style={[theme.centered, theme.marginVertical3x]}>
            <Text>Connected</Text>
          </View>
          <Button
            containerStyle={[theme.marginBottom3x]}
            onPress={store.sendTestTransaction}
            text="Send Test Transaction"
          />
          <Button
            containerStyle={[theme.marginBottom3x]}
            onPress={store.signTestMessage}
            text="Sign Message"
          />
          <Button onPress={store.resetConnection} text="Disconnect" />
          {store.formattedResult && (
            <View style={[theme.marginVertical6x]}>
              {Object.keys(store.formattedResult).map((key) => (
                <View key={key}>
                  <Text>{`${key}:`}</Text>
                  <Text>{store.formattedResult![key].toString()}</Text>
                </View>
              ))}
            </View>
          )}
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
  formattedResult: null,
  setWeb3(newValue: Store['web3']) {
    this.web3 = newValue;
  },
  setProvider(newValue: Store['provider']) {
    this.provider = newValue;
  },
  setFormattedResult(newValue: Store['formattedResult']) {
    this.formattedResult = newValue;
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
  async sendTestTransaction() {
    if (!this.web3 || !this.address) {
      return;
    }

    try {
      const tx = {
        to: '0x2E7F4dD3acD226DdAe10246a45337F815CF6B3ff',
        from: this.address,
        value: '1000000000000000000',
      };

      await this.web3.eth.sendTransaction(tx);
    } catch (error) {
      console.log('error =>', error);
    }
  },
  async signTestMessage() {
    if (!this.web3 || !this.address) {
      return;
    }

    try {
      const message = 'Hello World';
      const result = await this.web3.eth.sign(message, this.address);

      console.log('formatted', {
        method: 'personal_sign',
        address: this.address,
        valid: true,
        result,
      });

      this.setFormattedResult({
        method: 'personal_sign',
        address: this.address,
        valid: true,
        result,
      });
    } catch (error) {
      console.log('error =>', error);
    }
  },
  resetConnection() {
    this.provider?.close();
    this.setConnected(false);
    this.setProvider(null);
    this.setChainId(null);
    this.setAccounts(null);
    this.setAddress(null);
  },
});
