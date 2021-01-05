import React, { useEffect, useState } from 'react';
import {
  Linking,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';
import Button from '../../../common/components/Button';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ThemedStyles from '../../../styles/ThemedStyles';

type Props = {
  onConnect?: () => void;
  onDisconnect?: (code: number, reason: string) => void;
  onAccountsChanged?: (accounts: string[]) => void;
  onChainChanged?: (chainId: number) => void;
};

const web3Provider = new WalletConnectProvider({
  infuraId: '27e484dcd9e3efcfd25a83a78777cdf1',
  qrcode: false,
});

const styles = StyleSheet.create({
  modalBody: {
    borderRadius: 10,
    maxHeight: '20%',
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default function ({
  onConnect,
  onDisconnect,
  onAccountsChanged,
  onChainChanged,
}: Props) {
  const theme = ThemedStyles.style;
  const [modalVisible, setModalVisible] = useState(false);
  const [uri, setUri] = useState<string | null>(null);
  const hideModal = () => setModalVisible(false);

  const openMetaMask = () => {
    if (uri) {
      Linking.openURL('metamask://wc?uri=' + uri);
    }
  };

  useEffect(() => {
    const walletConnectInit = async () => {
      web3Provider.connector.on('display_uri', (err, payload) => {
        if (err) {
          return;
        }
        setUri(payload.params[0]);
      });

      web3Provider.on('accountsChanged', (accounts: string[]) => {
        onAccountsChanged && onAccountsChanged(accounts);
      });

      web3Provider.on('chainChanged', (chainId: number) => {
        onChainChanged && onChainChanged(chainId);
      });

      web3Provider.on('connect', () => {
        onConnect && onConnect();
      });

      web3Provider.on('disconnect', (code: number, reason: string) => {
        onDisconnect && onDisconnect(code, reason);
      });

      await web3Provider.enable();
    };

    walletConnectInit();
  }, [onConnect, onDisconnect, onAccountsChanged, onChainChanged]);

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

          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#transparent"
            onPress={openMetaMask}>
            <View
              style={[
                theme.rowJustifySpaceBetween,
                theme.alignCenter,
                theme.marginTop3x,
                theme.paddingHorizontal3x,
              ]}>
              <Text style={[theme.bold]}>MetaMask</Text>
              <Image
                style={[styles.icon]}
                source={require('@walletconnect/mobile-registry/logos/metamask.png')}
              />
            </View>
          </TouchableHighlight>
        </View>
      </Modal>

      <Button
        onPress={() => {
          setModalVisible(true);
        }}
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
    </>
  );
}
