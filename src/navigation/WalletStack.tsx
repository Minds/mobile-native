import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ThemedStyles from '~/styles/ThemedStyles';
import { WalletStackParamList } from './NavigationTypes';

const WalletStack = createNativeStackNavigator<WalletStackParamList>();
export default function () {
  return (
    <WalletStack.Navigator screenOptions={ThemedStyles.defaultScreenOptions}>
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
