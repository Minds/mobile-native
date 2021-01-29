import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';
import { IMobileRegistryEntry } from '@walletconnect/types';
import Button from '../Button';
import { Wallets, Logos } from './registry';
import ThemedStyles from '../../../styles/ThemedStyles';

type Props = {
  onWalletSelect: (wallet: IMobileRegistryEntry) => void;
};

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

export default function ({ onWalletSelect }: Props) {
  const theme = ThemedStyles.style;
  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = () => setModalVisible(false);

  return (
    <>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={hideModal}
        onBackButtonPress={hideModal}
        backdropOpacity={0.1}
        avoidKeyboard={true}
        animationInTiming={150}>
        <View
          style={[
            theme.flexContainer,
            theme.backgroundPrimary,
            styles.modalBody,
            theme.padding4x,
          ]}>
          <View style={[theme.rowJustifyCenter]}>
            <Text>Choose your preferred wallet</Text>
          </View>

          {Wallets.map((wallet) => (
            <TouchableHighlight
              activeOpacity={0.9}
              underlayColor="#transparent"
              onPress={() => onWalletSelect(wallet)}>
              <View
                style={[
                  theme.rowJustifySpaceBetween,
                  theme.alignCenter,
                  theme.marginTop3x,
                  theme.paddingHorizontal3x,
                ]}>
                <Text style={[theme.bold]}>{wallet.name}</Text>
                {Logos[wallet.shortName] && (
                  <Image
                    style={[styles.icon]}
                    source={Logos[wallet.shortName]}
                  />
                )}
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </Modal>

      <Button
        onPress={() => {
          setModalVisible(true);
        }}
        text="Open Modal"
        containerStyle={[
          theme.transparentButton,
          theme.paddingVertical3x,
          theme.fullWidth,
          theme.marginTop,
          theme.borderPrimary,
        ]}
        textStyle={theme.buttonText}
      />
    </>
  );
}
