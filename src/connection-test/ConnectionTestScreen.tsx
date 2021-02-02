import React from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import WalletConnectProvider from '@walletconnect/web3-provider';

import Web3 from 'web3';
import Button from '../common/components/Button';
import ThemedStyles from '../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';
import SessionStorage from '../blockchain/walletconnect/SessionStorage';
import WalletConnect from '../blockchain/walletconnect/WalletConnect';

const MINDS_METADATA = {
  description: 'Minds',
  url: 'https://www.minds.com',
  icons: ['https://cdn.minds.com/icon/100000000000000519/large/1589923649'],
  name: 'Minds',
};

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
  connect: () => void;
  init: () => void;
};

export default observer(() => {
  const theme = ThemedStyles.style;
  const store = useLocalStore<Store>(createStore);

  React.useEffect(() => {
    store.init();
  }, []);

  const startConnection = async () => {
    try {
      store.connect();
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
        <>
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
          <Button
            containerStyle={[theme.marginBottom3x]}
            onPress={store.signTestMessage}
            text="Sign Message"
          />
        </>
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
  async init() {
    const sessionStorage = new SessionStorage();
    await sessionStorage.loadFromStorage();
    const provider = new WalletConnectProvider({
      infuraId: '612f7850f87540d4a0c41796284ef45f',
      connector: new WalletConnect(
        {
          bridge: 'https://bridge.walletconnect.org',
          clientMeta: MINDS_METADATA,
        },
        undefined,
        // sessionStorage,
      ),
      chainId: 4,
    });
    // if (sessionStorage.session) {
    //   provider.enable();
    //   this.setConnected(true);
    // }
    console.log(provider);
    const web3 = new Web3(provider as any);
    this.setWeb3(web3);
    this.setProvider(provider);

    // open wallet using deep linking
    this.provider?.connector.on('display_uri', (_, payload) => {
      Linking.openURL(payload.params[0]);
    });

    this.provider?.on('connect', async () => {
      this.setConnected(true);
      this.setAccounts(provider.accounts);
      this.setAddress(provider.accounts[0]);
      this.setChainId(provider.chainId);
    });
    this.provider?.on('disconnect', async () => {
      this.setConnected(false);
      this.setAccounts(null);
      this.setAddress(null);
      this.setChainId(null);
    });
  },
  connect() {
    if (!this.provider) {
      throw Error('Call init first');
    }
    if (this.connected) {
      return;
    }
    this.provider.enable();
  },
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
    const tx = {
      to: this.address,
      from: this.address,
      value: this.web3.utils.toWei('0.00001', 'ether'),
    };

    this.web3.eth
      .sendTransaction(tx)
      .once('transactionHash', (hash: any) => {
        console.log('hash =>', hash);
      })
      .once('receipt', (receipt: any) => {
        console.log('receipt =>', receipt);
        this.setFormattedResult({
          method: 'send_transaction',
          address: this.address,
          valid: true,
          result: receipt,
        });
      })
      .once('error', (error: any) => {
        console.log('error =>', error);
      });
  },
  async signTestMessage() {
    if (!this.web3 || !this.address) {
      return;
    }

    try {
      const balance = await this.web3.eth.getBalance(this.address);
      alert(this.web3.utils.fromWei(balance, 'ether'));
      // const message = 'Hello World';
      // const result = await this.web3.eth.sign(message, this.address);

      // console.log('formatted', {
      //   method: 'personal_sign',
      //   address: this.address,
      //   valid: true,
      //   result,
      // });

      // this.setFormattedResult({
      //   method: 'personal_sign',
      //   address: this.address,
      //   valid: true,
      //   result,
      // });
    } catch (error) {
      console.log('error =>', error);
    }
  },
  resetConnection() {
    this.provider?.disconnect();
    this.setConnected(false);
    this.setChainId(null);
    this.setAccounts(null);
    this.setAddress(null);
  },
});
