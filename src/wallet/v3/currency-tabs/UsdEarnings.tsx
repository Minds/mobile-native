import React, { useEffect, useRef } from 'react';
import {
  WalletScreenNavigationProp,
  WalletScreenRouteProp,
} from '../../v2/WalletScreen';
import { View, Text, StyleSheet } from 'react-native';
import { WalletStoreType } from '../../v2/createWalletStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  walletStore: WalletStoreType;
  route: WalletScreenRouteProp;
};

const UsdEarnings = observer(({ walletStore, navigation }: PropsType) => {
  const theme = ThemedStyles.style;

  return (
    <ScrollView
      contentContainerStyle={[
        theme.paddingTop4x,
        theme.paddingHorizontal3x,
      ]}></ScrollView>
  );
});

const styles = StyleSheet.create({});

export default UsdEarnings;
