import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';
import { Wallets } from './registry';
import ThemedStyles from '../../../../styles/ThemedStyles';
import useWalletConnect from '../useWalletConnect';
import { observer } from 'mobx-react';

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

  const theme = ThemedStyles.style;

  return (
    <>
      <Modal
        isVisible={store.modalVisible}
        onBackdropPress={store.hideModal}
        onBackButtonPress={store.hideModal}
        backdropOpacity={0.1}
        avoidKeyboard={true}
        animationInTiming={150}>
        <View
          style={[
            theme.flexContainer,
            theme.bgPrimaryBackground,
            styles.modalBody,
            theme.padding4x,
          ]}>
          <View style={[theme.rowJustifyCenter]}>
            <Text>Choose your preferred wallet</Text>
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
                <Text style={[theme.bold]}>{wallet.name}</Text>
                {wallet.logo && (
                  <Image style={[styles.icon]} source={{ uri: wallet.logo }} />
                )}
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </Modal>
    </>
  );
});
