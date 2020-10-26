import React, { useCallback, useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import SettingInput from '../../../common/components/SettingInput';
import ThemedStyles from '../../../styles/ThemedStyles';
import QRCode from 'react-native-qrcode-svg';
import LabeledComponent from '../../../common/components/LabeledComponent';
import MenuItem from '../../../common/components/menus/MenuItem';
import BlockchainWalletService from '../../../blockchain/wallet/BlockchainWalletService';
import Share from 'react-native-share';
import i18n from '../../../common/services/i18n.service';
import { useLegacyStores } from '../../../common/hooks/use-stores';

export type ReceiverAddressScreenRouteProp = RouteProp<
  AppStackParamList,
  'ReceiverAddressScreen'
>;
export type ReceiverAddressScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReceiverAddressScreen'
>;

function getQRSize(scale = 1) {
  const { height, width } = Dimensions.get('window');
  return Math.floor((width < height ? width : height) * scale);
}

type PropsType = {
  navigation: ReceiverAddressScreenNavigationProp;
  route: ReceiverAddressScreenRouteProp;
};

const ReceiverAddressScreen = ({ route, navigation }: PropsType) => {
  const [privateKey, setPrivateKey] = useState<any>(null);
  const theme = ThemedStyles.style;
  const { blockchainWallet } = useLegacyStores();
  const { walletStore } = route.params;
  const receiver = walletStore.wallet.receiver;

  useEffect(() => {
    const getPrivateKey = async () => {
      const privateKey = await BlockchainWalletService.unlock(receiver.address);
      if (privateKey) {
        setPrivateKey(privateKey);
      }
    };

    getPrivateKey();
  }, [setPrivateKey, receiver.address]);

  const onDelete = useCallback(async () => {
    await blockchainWallet.delete(receiver.address);
    navigation.goBack();
  }, [navigation, blockchainWallet, receiver]);

  if (!receiver || !receiver.address) {
    return null;
  }

  const qrWrapper = [
    theme.padding4x,
    theme.backgroundSecondary,
    theme.centered,
    theme.marginTop6x,
    theme.marginBottom3x,
  ];

  qrWrapper.push(
    Platform.OS === 'ios' ? styles.iOSShadow : styles.androidShadow,
  );

  const items = [
    {
      title: 'Active Receive Address',
      icon: {
        name: 'check-circle-outline',
        type: 'material-community',
      },
      noIcon: false,
      onPress: () => {},
    },
    {
      title: 'Export private key',
      noIcon: true,
      onPress: async () => {
        let privateKeyTemp = privateKey;
        if (!privateKeyTemp) {
          return;
        }

        if (privateKeyTemp.substr(0, 2).toLowerCase() === '0x') {
          privateKeyTemp = privateKeyTemp.substr(2);
        }

        const shareOptions: any = {
          message: privateKeyTemp,
        };

        if (Platform.OS === 'android') {
          shareOptions.url = 'data:text/plain;base64,';
        }

        await Share.open(shareOptions);
      },
    },
    {
      title: 'Remove receiver address',
      noIcon: true,
      onPress: () => {
        Alert.alert(
          i18n.t('confirmMessage'),
          i18n.t('blockchain.deleteConfirmWarning'),
          [
            { text: i18n.t('cancel'), style: 'cancel' },
            { text: i18n.t('yesImSure'), onPress: () => onDelete() },
          ],
          { cancelable: false },
        );
      },
    },
  ];

  return (
    <ScrollView style={theme.paddingTop3x}>
      <SettingInput
        placeholder="Address Label"
        value={receiver.label}
        editable={false}
        wrapperBorder={[theme.borderTop, theme.borderBottom]}
      />

      <View style={theme.marginBottom7x}>
        <View style={qrWrapper}>
          <QRCode
            value={`ethereum:${receiver.address.toLowerCase()}`}
            size={getQRSize(1 / 2)}
          />
        </View>
        <Text style={theme.textCenter}>{receiver.address.toLowerCase()}</Text>
      </View>

      <View
        style={[
          theme.rowJustifyStart,
          theme.paddingLeft4x,
          theme.marginBottom4x,
        ]}>
        <LabeledComponent label={'Balance'} labelStyle={styles.labelStyle}>
          <Text style={theme.fontXL}>{receiver.balance}</Text>
        </LabeledComponent>
      </View>

      <View style={theme.marginBottom7x}>
        <MenuItem item={items[0]} />
        {privateKey && <MenuItem item={items[1]} />}
      </View>

      <View style={theme.marginBottom7x}>
        <MenuItem item={items[2]} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  iOSShadow: {
    shadowOffset: {
      width: 1,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  androidShadow: {
    elevation: 5,
  },
  labelStyle: {
    fontSize: 15,
    marginBottom: 5,
  },
});

export default ReceiverAddressScreen;
