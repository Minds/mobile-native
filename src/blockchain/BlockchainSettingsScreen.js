import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet
} from 'react-native';

import Modal from 'react-native-modal';

import { observer, inject } from 'mobx-react/native'

import QRCode from 'react-native-qrcode';

import { CommonStyle } from "../styles/Common";

import BlockchainApiService from './BlockchainApiService';
import Web3Service from "./Web3Service";
import StorageService from '../common/services/storage.service';
import BlockchainSettingsOverviewView from "./BlockchainSettingsOverviewView";

@inject('blockchain')
@inject('wallet')
@observer
export default class BlockchainSettingsScreen extends Component {
  state = {
    address: '',
    privateKey: '',
    pristineAddress: true,
    inProgress: false,
    importedWalletPkey: '',
    importingWallet: false,
  };

  componentWillMount() {
    this.load();
  }

  async load() {
    this.setState({ inProgress: true });

    try {
      let address = await BlockchainApiService.getWallet(),
        privateKey = '';

      if (address) {
        privateKey = (await StorageService.getItem(`${address.toLowerCase()}:pk`)) || '';
      }

      this.setState({ address, privateKey });
    } catch (e) {
      console.error(e);
      // TODO: Show to user?
    } finally {

      this.setState({ inProgress: false });
    }
  }

  async save() {
    if (!this.isValidAddress()) {
      return;
    }

    try {
      if (!this.areAddressAndPrivateKeyConsistent()) {
        const doSave = await this._fixConsistency();

        if (!doSave) {
          return;
        }
      }

      this.setState({ inProgress: true });

      await BlockchainApiService.setWallet(this.state.address);
      this.props.wallet.refresh(true);

      if (this.state.address && this.state.privateKey) {
        await StorageService.setItem(`${this.state.address.toLowerCase()}:pk`, this.state.privateKey, true, 'ethereum');
      }

      this.setState({ pristineAddress: true });
    } catch (e) {
      // TODO: Show to user?
      console.error(e);
    } finally {
      this.setState({ inProgress: false });
    }
  }

  areAddressAndPrivateKeyConsistent() {
    if (!this.state.address || !this.state.privateKey) {
      return true;
    }

    let pkAddress = Web3Service.getAddressFromPK(this.state.privateKey).toLowerCase();

    return this.state.address.toLowerCase() === pkAddress;
  }

  _fixConsistency() {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Wallet consistency issue',
        `
          The new wallet address doesn't match the currently stored private
          key. Save anyways? You might not be able to do transactions until
          the new address' private key is set.
        `,
        [
          {
            text: 'No',
            onPress: () => resolve(false),
            style: 'cancel'
          },
          {
            text: 'Yes, save',
            onPress: () => {
              this.setState({ privateKey: '' });
              resolve(true);
            }
          }
        ],
        {
          cancelable: false,
          onDismiss: () => resolve(false)
        }
      );
    });
  }

  async restore() {
    this.setState({ address: Web3Service.getAddressFromPK(this.state.privateKey), pristineAddress: true });
  }

  isValidAddress() {
    return !this.state.address || Web3Service.web3.utils.isAddress(this.state.address);
  }

  canBeShared() {
    return this.state.pristineAddress && !!this.state.address && this.isValidAddress()
  }

  importWalletPopup() {
    this.setState({ importingWallet: true, importedWalletPkey: '' });
  }

  newWallet() {
    Alert.alert(
      'New Ethereum wallet',
      `This will generate a new Ethereum wallet address and private key. Are you sure?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, create wallet', onPress: () => this._createWallet() }
      ]
    );
  }

  _createWallet() {
    const { address, privateKey } = Web3Service.createWallet();

    this.setState({ address, privateKey, pristineAddress: false });
  }

  canImportPkey() {
    const privateKey = this.state.importedWalletPkey;
    return !!privateKey && privateKey.length === 64 && !!Web3Service.getAddressFromPK(`0x${privateKey}`);
  }

  importWallet() {
    const privateKey = `0x${this.state.importedWalletPkey}`,
      address = Web3Service.getAddressFromPK(privateKey);

    Alert.alert(
      'Import Ethereum wallet',
      `This will use ${address} based on that private key. Are you sure?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, import wallet', onPress: () => this._importWalletUsingPkey() }
      ]
    );
  }

  _importWalletUsingPkey() {
    let privateKey = `0x${this.state.importedWalletPkey}`,
      address = Web3Service.getAddressFromPK(privateKey);

    this.setState({ address, privateKey, pristineAddress: false });
    this.closeImportModal();
  }

  closeImportModal() {
    this.setState({ importingWallet: false, importedWalletPkey: '' });
  }

  getQRSize(scale = 1) {
    const { height, width } = Dimensions.get('window');
    return Math.floor((width < height ? width : height) * scale);
  }

  render() {
    return (
      <ScrollView style={ CommonStyle.backgroundLight }>
        <BlockchainSettingsOverviewView />

        <View style={ CommonStyle.screen }>
          <View style={ CommonStyle.viewTitleContainer } >
            <Text style={ CommonStyle.viewTitle }>ETHEREUM WALLET</Text>
            <ActivityIndicator animating={ this.state.inProgress } size="small" />
          </View>

          <View style={ CommonStyle.field }>
            <Text style={ CommonStyle.fieldLabel }>WALLET ADDRESS</Text>

            <TextInput
              style={ [ CommonStyle.fieldTextInput, style.addressTextInput ] }
              onChangeText={ address => this.setState({ address, pristineAddress: false }) }
              value={ this.state.address }
              placeholder="0x0000000000000000000000000000000000000000"
            />
          </View>

          <View>
            <Button
              disabled={ this.state.inProgress || this.state.pristineAddress || !this.isValidAddress() }
              onPress={ () => this.save() }
              title="Save"
              accessibilityLabel="Save wallet address"
            />

            { !this.state.pristineAddress && !!this.state.privateKey && <Button
              disabled={ this.state.inProgress }
              onPress={ () => this.restore() }
              title="Restore"
              accessibilityLabel="Restores the wallet address from current the private key"
            /> }

            { !this.state.address && <Button
              disabled={ this.state.inProgress }
              onPress={ () => this.importWalletPopup() }
              title="Import Ethereum wallet"
              accessibilityLabel="Imports an Ethereum wallet using its private key"
            /> }

            { !this.state.address && <Button
              disabled={ this.state.inProgress }
              onPress={ () => this.newWallet() }
              title="Create new Ethereum wallet"
              accessibilityLabel="Creates a new Ethereum wallet and associates it with this account"
            /> }
          </View>

          { this.canBeShared() && <View>
            <View style={ [ CommonStyle.rowJustifyCenter, style.qrCodeView ] }>
              <QRCode
                value={ `ethereum:${this.state.address.toLowerCase()}` }
                size={ this.getQRSize(3 / 4) }
              />
            </View>

            <View style={ [ CommonStyle.rowJustifyCenter, style.qrCodeView ] }>
              <Text style={ style.qrCodeLegend }>{ this.state.address.toUpperCase() }</Text>
            </View>
          </View> }

        </View>

        <Modal
          isVisible={ this.state.importingWallet }
          backdropColor="white"
          backdropOpacity={ 1 }
        >
          <View style={ [ CommonStyle.flexContainer, CommonStyle.modalScreen ] }>
            <Text style={ CommonStyle.viewTitle }>IMPORT ETHEREUM WALLET</Text>

            <View style={ CommonStyle.field }>
              <Text style={ CommonStyle.fieldLabel }>WALLET ADDRESS</Text>

              <TextInput
                style={ [ CommonStyle.fieldTextInput, style.addressTextInput ] }
                onChangeText={ importedWalletPkey => this.setState({ importedWalletPkey }) }
                value={ this.state.importedWalletPkey }
                placeholder="1234567890abcdef…"
                multiline={ true }
                maxLength={ 64 }
              />
            </View>

            <View>
              <Button
                disabled={ !this.canImportPkey() }
                onPress={ () => this.importWallet() }
                title="Import"
                accessibilityLabel="Import wallet address"
              />

              <Button
                onPress={ () => this.closeImportModal }
                title="Cancel"
                accessibilityLabel="Cancel import wallet modal"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  addressTextInput: {
    fontSize: 16,
    fontWeight: '700',
    padding: 15
  },
  qrCodeView: {
    paddingTop: 32
  },
  qrCodeLegend: {
    letterSpacing: 2,
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    fontWeight: '300'
  }
});
