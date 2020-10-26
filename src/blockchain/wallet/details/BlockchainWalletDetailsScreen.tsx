//@ts-nocheck
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import Share from 'react-native-share';
import QRCode from 'react-native-qrcode-svg';

import TransparentButton from '../../../common/components/TransparentButton';
import BlockchainWalletService from '../BlockchainWalletService';
import NavigationService from '../../../navigation/NavigationService';
import { CommonStyle } from '../../../styles/Common';
import number from '../../../common/helpers/number';
import BlockchainApiService from '../../BlockchainApiService';
import i18n from '../../../common/services/i18n.service';
import colors from '../../../styles/Colors';

// Helpers

function getQRSize(scale = 1) {
  const { height, width } = Dimensions.get('window');
  return Math.floor((width < height ? width : height) * scale);
}

function addressExcerpt(address) {
  return `0×${address.substr(2, 5)}...${address.substr(-5)}`;
}

function formatAddressUppercase(address) {
  return `0×${address.substr(2).toUpperCase()}`;
}

// Class

@inject('blockchainWallet')
@observer
export default class BlockchainWalletDetailsScreen extends Component {
  state = {
    editable: false,
    importable: false,
    edit: false,
    address: '',
    alias: '',
    remote: false,
    offchain: false,
    current: false,
    tokens: null,
    eth: null,
  };

  aliasTextInputRef;

  _deleted = false;

  componentWillMount() {
    this.setState({
      editable: false,
      importable: false,
      address: this.props.route.params.address,
      edit: !!this.props.route.params.edit,
      new: this.props.route.params.new,
      offchain: false,
      tokens: null,
      eth: null,
    });

    this.load(this.props.route.params.address);
  }

  componentDidMount() {
    if (this.state.new) {
      this.props.blockchainWallet.load(true);
    }
  }

  componentWillUnmount() {
    this.setLabel();
  }

  async load(passedAddress) {
    const address = passedAddress || this.state.address,
      offchain = address.toLowerCase() === 'offchain';

    const wallet = !offchain && (await BlockchainWalletService.get(address));

    if (!wallet) {
      this.setState({
        editable: false,
        importable: !offchain,
        delete: false,
        alias: 'OffChain Wallet',
        remote: !offchain,
        offchain: offchain,
        current: false,
      });

      this.loadFunds(address);

      return;
    }

    this.setState({
      editable: true,
      delete: false,
      importable: false,
      alias: wallet.alias || '',
      remote: wallet.remote,
      current: wallet.current,
      offchain: false,
    });

    this.loadFunds(address);
    this.loadRemote();
  }

  async loadFunds(passedAddress) {
    const address = passedAddress || this.state.address;

    this.setState({
      tokens: null,
      eth: null,
    });

    const { tokens, eth } = await BlockchainWalletService.getFunds(
      address,
      true,
    );

    this.setState({
      tokens,
      eth,
    });
  }

  async loadRemote() {
    try {
      remoteWallet = await BlockchainApiService.getWallet();
    } catch (e) {}

    if (
      remoteWallet &&
      remoteWallet.toLowerCase() === this.state.address.toLowerCase()
    ) {
      this.setState({ remote: true });
    }
  }

  balanceItem() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>{i18n.t('blockchain.balance')}</Text>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          <Text style={styles.fundsItemValue}>
            {this.state.tokens !== null
              ? number(this.state.tokens, 0, 4)
              : '...'}
          </Text>
        </View>
      </View>
    );
  }

  gasItem() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>{i18n.t('blockchain.gasEth')}</Text>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          <Text style={styles.fundsItemValue}>
            {this.state.eth !== null ? number(this.state.eth, 0, 4) : '...'}
          </Text>
        </View>
      </View>
    );
  }

  labelItem() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>{i18n.t('name')}</Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>
              {i18n.t('blockchain.walletNameExample')}
            </Text>
          </View>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          <TextInput
            ref={(ref) => (this.aliasTextInputRef = ref)}
            editable={true}
            style={[
              CommonStyle.fieldTextInput,
              styles.aliasTextInput,
              !this.state.edit && styles.aliasTextInputReadonly,
            ]}
            onBlur={(e) => this.setLabel()}
            onChangeText={(alias) => this.setState({ alias })}
            value={this.state.alias}
            placeholder={addressExcerpt(this.state.address)}
          />
        </View>
      </View>
    );
  }

  async setLabel() {
    if (!this._deleted) {
      await this.props.blockchainWallet.save(this.state.address, {
        alias: this.state.alias,
      });
    }
  }

  receiverItem() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>
            {i18n.t('blockchain.receiverAddress')}
          </Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>
              {i18n.t('blockchain.shouldBeReceiver')}
            </Text>
          </View>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          <Switch value={this.state.remote} onValueChange={this.setAsRemote} />
        </View>
      </View>
    );
  }

  setAsCurrentAction = async () => {
    this.setState({
      current: true,
    });

    await BlockchainWalletService.setCurrent(this.state.address);
    await this.props.blockchainWallet.load(true);
  };

  setAsRemote = async () => {
    this.setState({
      remote: true,
    });

    await BlockchainApiService.setWallet(this.state.address);
    await this.props.blockchainWallet.load(true);
  };

  exportItem() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>{i18n.t('export')}</Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>
              {i18n.t('blockchain.downloadPrivate')}
            </Text>
          </View>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          <TransparentButton
            style={styles.actionButton}
            color={colors.primary}
            onPress={this.export}
            title="EXPORT"
          />
        </View>
      </View>
    );
  }

  export = async () => {
    let privateKey = await BlockchainWalletService.unlock(this.state.address);

    if (!privateKey) {
      return;
    }

    if (privateKey.substr(0, 2).toLowerCase() === '0x') {
      privateKey = privateKey.substr(2);
    }

    const shareOptions = {
      message: privateKey,
    };

    if (Platform.OS == 'android') {
      shareOptions.url = 'data:text/plain;base64,';
    }

    await Share.open(shareOptions);
  };

  deleteItem() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>{i18n.t('delete')}</Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>
              {i18n.t('blockchain.deleteWarning')}
            </Text>
          </View>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          {!this.state.delete && this.state.editable && (
            <TransparentButton
              style={styles.actionButton}
              color={colors.danger}
              onPress={this.deleteAction}
              title={i18n.t('delete').toUpperCase()}
            />
          )}
        </View>
      </View>
    );
  }

  deleteAction = () => {
    Alert.alert(
      i18n.t('confirmMessage'),
      i18n.t('blockchain.deleteConfirmWarning'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('yesImSure'), onPress: () => this.delete() },
      ],
      { cancelable: false },
    );
  };

  async delete() {
    await this.props.blockchainWallet.delete(this.state.address);
    this._deleted = true;
    this.props.navigation.goBack();
  }

  import = () => {
    NavigationService.navigate('BlockchainWalletImport', {
      address: this.state.address,
      onSuccess: this.importActionReload,
    });
  };

  importActionReload = () => {
    this.setState({
      editable: true,
      edit: false,
    });

    this.load(this.state.address);
  };

  importItem() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>{i18n.t('import')}</Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>
              {i18n.t('blockchain.importKeyNotExist')}
            </Text>
          </View>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          {!this.state.delete && (
            <TransparentButton
              style={styles.actionButton}
              color={colors.primary}
              onPress={this.import}
              title={i18n.t('import').toUpperCase()}
            />
          )}
        </View>
      </View>
    );
  }

  qrCode() {
    return (
      <View>
        {!this.state.offchain && (
          <View style={[CommonStyle.rowJustifyCenter, styles.qrCodeView]}>
            <QRCode
              value={`ethereum:${this.state.address.toLowerCase()}`}
              size={getQRSize(3 / 4)}
            />
          </View>
        )}

        <View style={[CommonStyle.rowJustifyCenter, styles.qrCodeView]}>
          <Text style={styles.qrCodeLegend} selectable>
            {this.state.address}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        <View style={CommonStyle.flexContainer}>
          {this.state.editable && this.labelItem()}

          {!this.state.edit && this.qrCode()}

          {this.balanceItem()}

          {!this.state.offchain && this.gasItem()}

          {!this.state.offchain && this.receiverItem()}

          {this.state.importable && this.importItem()}

          {this.state.editable && this.exportItem()}

          {this.state.editable && this.deleteItem()}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 5,
  },
  title: {
    paddingBottom: 3,
  },
  subtitle: {
    fontSize: 12,
  },

  section: {
    paddingTop: 20,
  },

  actionBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  secondaryActionBar: {
    marginTop: 20,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  actionButton: {
    marginLeft: 5,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  itemBody: {
    //flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemActions: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemSpacer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    // fontWeight: '800',
    fontFamily: 'Roboto-Black', // workaround android ignoring >= 800
  },
  supportingTextContainer: {
    flexDirection: 'row',
  },
  supportingText: {
    fontSize: 11,
    color: '#aaa',
    flex: 1,
  },

  fundsView: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  fundsItem: {
    padding: 5,
  },
  fundsItemValue: {
    fontSize: 16,
    letterSpacing: 1,
    color: colors.primary,
    fontWeight: '700',
  },
  fundsItemLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: '#444',
    fontWeight: '300',
  },

  aliasTextInput: {
    fontSize: 16,
    width: 150,
    fontWeight: '700',
  },
  aliasTextInputReadonly: {
    borderColor: '#f0f0f0',
  },

  qrCodeView: {
    paddingTop: 30,
  },
  qrCodeLegend: {
    letterSpacing: 2,
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    fontWeight: '300',
    paddingLeft: 16,
    paddingRight: 16,
  },

  setAsOnText: {
    color: colors.darkGreyed,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.darkGreyed,
    borderRadius: 3,
  },
});
