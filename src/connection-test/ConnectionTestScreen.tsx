import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import Button from '../common/components/Button';
import ThemedStyles from '../styles/ThemedStyles';
import { observer } from 'mobx-react';
import WalletConnectModal from '../common/components/wallet-connect-modal/WalletConnectModal';
import useWalletConnect from '../blockchain/walletconnect/useWalletConnect';
import { convertUtf8ToHex } from '@walletconnect/utils';

export default observer(() => {
  const theme = ThemedStyles.style;
  const store = useWalletConnect();

  const startConnection = async (wallet) => {
    console.log('connectiong toooo', wallet);

    try {
      store
        .connect(wallet)
        .then(() => console.log('CONNECTED ' + store.address));
    } catch (error) {
      console.log('error =>', error);
    }
  };
  const sendTestTransaction = async () => {
    if (!store.web3 || !store.address) {
      return;
    }
    const tx = {
      to: store.address,
      from: store.address,
      value: store.web3.utils.toWei('0.00001', 'ether'),
    };

    store.web3.eth
      .sendTransaction(tx)
      .once('transactionHash', (hash: any) => {
        console.log('hash =>', hash);
      })
      .once('receipt', (receipt: any) => {
        console.log('receipt =>', receipt);
      })
      .once('error', (error: any) => {
        console.log('error =>', error);
      });
  };
  const signTestMessage = async () => {
    if (!store.web3 || !store.address) {
      return;
    }

    try {
      const message = 'Hello World';

      const params = [convertUtf8ToHex(message), store.address];
      console.log(params);
      const result = await store.provider?.connector.signPersonalMessage(
        params,
      );

      console.log('formatted', {
        method: 'personal_sign',
        address: store.address,
        valid: true,
        result,
      });

      // this.setFormattedResult({
      //   method: 'personal_sign',
      //   address: this.address,
      //   valid: true,
      //   result,
      // });
    } catch (error) {
      console.log('error =>', error);
    }
  };

  return (
    <ScrollView
      style={[theme.flexContainer, theme.backgroundPrimary]}
      contentContainerStyle={theme.padding4x}>
      {store.connected && store.web3 ? (
        <>
          <View style={[theme.centered, theme.marginVertical3x]}>
            <Text>Connected</Text>
          </View>
          <Button
            containerStyle={[theme.marginBottom3x]}
            onPress={sendTestTransaction}
            text="Send Test Transaction"
          />
          <Button
            containerStyle={[theme.marginBottom3x]}
            onPress={signTestMessage}
            text="Sign Message"
          />
          <Button onPress={store.resetConnection} text="Disconnect" />
        </>
      ) : (
        <WalletConnectModal
          onWalletSelect={(wallet) => {
            startConnection(wallet);
          }}
        />
      )}
    </ScrollView>
  );
});
