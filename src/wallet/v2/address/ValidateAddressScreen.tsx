import React from 'react';
import { View } from 'react-native';
import WalletConnector from '../../../common/components/wallet-connector/WalletConnector';
import apiService from '../../../common/services/api.service';
import sessionService from '../../../common/services/session.service';
import ThemedStyles from '../../../styles/ThemedStyles';

export default function ValidateAddressScreen() {
  const theme = ThemedStyles.style;
  const props = {
    onConnect: async (connector: any) => {
      try {
        const msg = JSON.stringify({
          user_guid: sessionService.getUser().guid,
          unix_ts: Date.now() / 1000,
        });
        connector
          .signPersonalMessage([msg, connector.accounts[0]])
          .then((signature) => {
            // Returns signature.
            console.log('ValidateAddressScreen signMessage result', signature);
            apiService
              .post('api/v3/blockchain/unique-onchain/validate', {
                signature,
                payload: msg,
                address: connector.accounts[0],
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
