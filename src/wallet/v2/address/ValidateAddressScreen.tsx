import Web3 from 'web3';
import React from 'react';
import { View } from 'react-native';
import WalletConnector from '../../../common/components/wallet-connector/WalletConnector';
import apiService from '../../../common/services/api.service';
import sessionService from '../../../common/services/session.service';
import ThemedStyles from '../../../styles/ThemedStyles';

function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

export default function ValidateAddressScreen() {
  const theme = ThemedStyles.style;
  const props = {
    onConnect: async (provider: any) => {
      try {
        const msg = JSON.stringify({
          user_guid: sessionService.getUser().guid,
          unix_ts: Date.now() / 1000,
        });
        const web3 = new Web3(provider);
        const hashMessage = web3.eth.accounts.hashMessage(msg);
        provider.connector
          .signPersonalMessage([msg, provider.connector.accounts[0]])
          .then((signature) => {
            // Returns signature.
            apiService
              .post('api/v3/blockchain/unique-onchain/validate', {
                signature,
                payload: msg,
                address: provider.connector.accounts[0],
              })
              .then((postResult) => {
                console.log('postResult', postResult);
              })
              .catch((error) => {
                console.log('Request Failed', error);
              });
          })
          .catch((error) => {
            // Error returned when rejected
            console.log('Sign Failed', error);
          });
      } catch (err) {
        console.log('Validation failed', err);
      }
    },
    onDisconnect: (code: number, reason: string) =>
      console.log('onDisconnect', code, reason),
    onAccountsChange: (accounts: string[]) =>
      console.log('onAccountsChange', accounts),
    onChainChanged: (chainId: number) => console.log('onChainChanged', chainId),
  };

  return (
    <View style={theme.flexContainer}>
      <WalletConnector {...props} />
    </View>
  );
}
