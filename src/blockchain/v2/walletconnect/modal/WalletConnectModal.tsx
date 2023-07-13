import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { Wallets } from './registry';
import ThemedStyles from '../../../../styles/ThemedStyles';
import useWalletConnect from '../useWalletConnect';
import { observer } from 'mobx-react';
import MText from '../../../../common/components/MText';
import {
  BottomSheetScrollView,
  default as BottomSheetType,
} from '@gorhom/bottom-sheet';
import { BottomSheet } from '~/common/components/bottom-sheet';
import { ONCHAIN_ENABLED } from '~/config/Config';
import { Image } from 'expo-image';

const styles = StyleSheet.create({
  modalBody: {
    borderRadius: 10,
    maxHeight: '45%',
    justifyContent: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default observer(function () {
  const store = useWalletConnect();
  const ref = React.useRef<BottomSheetType>(null);

  React.useEffect(() => {
    if (store.modalVisible) {
      ref.current?.expand();
    } else {
      ref.current?.close();
    }
  }, [store.modalVisible]);

  if (!ONCHAIN_ENABLED) {
    return null;
  }

  const theme = ThemedStyles.style;

  return (
    <BottomSheet ref={ref}>
      <BottomSheetScrollView
        contentContainerStyle={[
          theme.bgPrimaryBackground,
          theme.flexContainer,
        ]}>
        <View style={theme.rowJustifyCenter}>
          <MText>Choose your preferred wallet</MText>
        </View>

        {Wallets.map((wallet, index) => (
          <TouchableHighlight
            key={`wallet${index}`}
            activeOpacity={0.9}
            underlayColor="#transparent"
            onPress={() => store.setSelectedWallet(wallet)}>
            <View
              style={[
                theme.rowJustifySpaceBetween,
                theme.alignCenter,
                theme.marginTop3x,
                theme.paddingHorizontal3x,
              ]}>
              <MText style={[theme.bold]}>{wallet.name}</MText>
              {wallet.logo && (
                <Image style={[styles.icon]} source={{ uri: wallet.logo }} />
              )}
            </View>
          </TouchableHighlight>
        ))}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});
