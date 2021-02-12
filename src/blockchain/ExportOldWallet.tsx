import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { hideMessage, showMessage } from 'react-native-flash-message';
import Share from 'react-native-share';
import Web3 from 'web3';
import i18n from '../common/services/i18n.service';
import storageService from '../common/services/storage.service';
import NavigationService from '../navigation/NavigationService';
import ThemedStyles from '../styles/ThemedStyles';

function storageKey(key) {
  return `BlockchainWallet:${key}`;
}

function privateKeyStorageKey(address) {
  return storageKey(`wallet:${address.toLowerCase()}:privateKey`);
}

export async function fetchListFromStorage(): Promise<Array<any>> {
  return (await storageService.getItem(storageKey('wallets'))) || [];
}

export async function setWallets(wallets) {
  await storageService.setItem(storageKey('wallets'), wallets);
}

export async function hasPrivateKeyInStorage(address) {
  return await storageService.hasItem(privateKeyStorageKey(address));
}

export async function fetchPrivateKeyFromStorage(address, secret) {
  return await storageService.getItem(privateKeyStorageKey(address), secret);
}

/**
 * Returns the wallets with private key stored
 */
export async function getExportableWallets(): Promise<Array<any>> {
  try {
    const wallets = await fetchListFromStorage();
    for (let index = 0; index < wallets.length; index++) {
      const w = wallets[index];
      if (w.address) {
        w.hasPrivate = await hasPrivateKeyInStorage(w.address);
      }
    }
    return wallets.filter((w) => w.hasPrivate && !w.exported);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function showMessageForPrivateKey() {
  const wallets: Array<any> = await getExportableWallets();
  if (!wallets?.length) {
    return;
  }
  const theme = ThemedStyles.style;
  showMessage({
    position: 'center',
    message: '',
    floating: true,
    duration: 0,
    //@ts-ignore
    renderCustomContent: () => (
      <View>
        <Text style={[theme.fontXL, theme.textCenter]} onPress={hideMessage}>
          {i18n.t('blockchain.exportLegacy1')}
        </Text>
        <Text
          style={[theme.fontML, theme.marginTop4x, theme.textCenter]}
          onPress={hideMessage}>
          {i18n.t('blockchain.exportLegacy2')}
        </Text>
        <View
          style={[
            theme.rowJustifySpaceEvenly,
            theme.marginTop6x,
            theme.paddingTop2x,
            theme.borderTopHair,
            theme.borderPrimary,
            styles.messageHorizontalLine,
          ]}>
          <View
            style={[
              theme.borderPrimary,
              theme.borderRightHair,
              theme.justifyCenter,
              styles.messageVerticalLine,
            ]}>
            <Text
              style={[theme.fontXL, theme.colorLink, theme.paddingHorizontal4x]}
              onPress={hideMessage}>
              {i18n.t('no')}
            </Text>
          </View>
          <TouchableOpacity
            style={theme.justifyCenter}
            onPress={() => {
              hideMessage();
              NavigationService.navigate('ExportLegacyWallet');
            }}>
            <Text
              style={[
                theme.fontXL,
                theme.colorLink,
                theme.paddingHorizontal4x,
              ]}>
              {i18n.t('yes')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    color: ThemedStyles.getColor('primary_text'),
    titleStyle: ThemedStyles.style.fontXL,
    backgroundColor: ThemedStyles.getColor('secondary_background'),
    type: 'default',
  });
}

function normalizePrivateKey(privateKey) {
  if (!privateKey || typeof privateKey !== 'string') {
    throw new Error('E_INVALID_PRIVATE_KEY_VALUE');
  }

  privateKey = privateKey.toLowerCase();

  if (privateKey.substr(0, 2) !== '0x') {
    privateKey = `0x${privateKey}`;
  }

  return privateKey;
}

function getAddressFromPK(privateKey) {
  if (!privateKey) {
    return null;
  }

  if (privateKey.substr(0, 2).toLowerCase() !== '0x') {
    privateKey = `0x${privateKey}`;
  }

  const web3 = new Web3();

  return web3.eth.accounts.privateKeyToAccount(privateKey).address;
}

export function isValidPrivateKey(privateKey) {
  try {
    privateKey = normalizePrivateKey(privateKey);
    return (
      !!privateKey && privateKey.length === 66 && !!getAddressFromPK(privateKey)
    );
  } catch (e) {
    return false;
  }
}

export async function exportPrivate(privateKey: string) {
  if (privateKey.substr(0, 2).toLowerCase() === '0x') {
    privateKey = privateKey.substr(2);
  }

  const shareOptions: any = {
    message: privateKey,
  };

  if (Platform.OS === 'android') {
    shareOptions.url = 'data:text/plain;base64,';
  }

  await Share.open(shareOptions);
}

const styles = {
  messageHorizontalLine: {
    marginLeft: -20,
    marginRight: -20,
  },
  messageVerticalLine: {
    marginTop: -10,
    marginBottom: -14,
  },
};
