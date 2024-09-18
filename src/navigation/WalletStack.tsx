import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WalletStackParamList } from './NavigationTypes';
import sp from '~/services/serviceProvider';

const WalletStack = createNativeStackNavigator<WalletStackParamList>();
export default function () {
  return (
    <WalletStack.Navigator screenOptions={sp.styles.defaultScreenOptions}>
      <WalletStack.Screen
        name="Wallet"
        getComponent={() => require('~/wallet/v3/WalletScreen').default}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen
        name="CreditTransactions"
        getComponent={() =>
          require('~/modules/gif-card/screens/CreditTransactionsScreen').default
        }
        options={{ headerShown: false }}
      />
    </WalletStack.Navigator>
  );
}
