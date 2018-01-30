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
} from 'react-native';

import { btoa } from 'abab';

import Share from 'react-native-share';

import QRCode from 'react-native-qrcode';

import TransparentButton from '../../../common/components/TransparentButton';
import Touchable from '../../../common/components/Touchable';

import { NavigationActions } from 'react-navigation';

import { observer, inject } from 'mobx-react/native'

import BlockchainWalletService from '../BlockchainWalletService';
import NavigationStoreService from '../../../common/services/navigation.service';

import { CommonStyle } from "../../../styles/Common";
import number from '../../../common/helpers/number';
import BlockchainApiService from '../../BlockchainApiService';

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
    current: false,
    tokens: null,
    eth: null
  };

  aliasTextInputRef;

  componentWillMount() {
    this.setState({
      editable: false,
      importable: false,
      address: this.props.navigation.state.params.address,
      edit: !!this.props.navigation.state.params.edit,
      new: this.props.navigation.state.params.new,
      tokens: null,
      eth: null,
    });

    this.load(this.props.navigation.state.params.address);
  }

  componentDidMount() {
    if (this.state.new) {
      this.props.blockchainWallet.load(true);
    }
  }

  componentWillUnmount() {
    this.setLabel();
  }

  async load(address) {
    const wallet = await BlockchainWalletService.get(address || this.state.address);

    if (!wallet) {
      this.setState({
        editable: false,
        importable: true,
        delete: false,
        alias: '',
        remote: true,
        current: false,
      });

      this.loadFunds();

      return;
    }

    this.setState({
      editable: true,
      delete: false,
      importable: false,
      alias: wallet.alias || '',
      remote: wallet.remote,
      current: wallet.current,
    });

    this.loadFunds();
    this.loadRemote();
  }

  async loadFunds() {
    this.setState({
      tokens: null,
      eth: null,
    });

    const { tokens, eth } = await BlockchainWalletService.getFunds(this.state.address, true);

    this.setState({
      tokens,
      eth,
    });
  }

  async loadRemote() {
    try {
      remoteWallet = await BlockchainApiService.getWallet();
    } catch (e) { }

    if (remoteWallet && remoteWallet.toLowerCase() === this.state.address.toLowerCase()) {
      this.setState({ remote: true });
    }
  }

  balanceItem() {
    return (
      <View style={styles.itemContainer}>

        <View style={styles.itemBody}>
          <Text style={styles.label}>Balance</Text>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          <Text style={styles.fundsItemValue}>{this.state.tokens !== null ? number(this.state.tokens, 0, 4) : '...'}</Text>
        </View>
  
      </View>
    );
  }

  labelItem() {
    return (
      <View style={styles.itemContainer}>

        <View style={styles.itemBody}>
          <Text style={styles.label}>Label</Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>eg. Mobile Spending</Text>
          </View>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          <TextInput
            ref={ref => this.aliasTextInputRef = ref}
            editable={true}
            style={[
              CommonStyle.fieldTextInput,
              styles.aliasTextInput,
              !this.state.edit && styles.aliasTextInputReadonly
            ]}
            onBlur={(e) => this.setLabel()}
            onChangeText={alias => this.setState({alias})}
            value={this.state.alias}
            placeholder={addressExcerpt(this.state.address)}
          />
        </View>
      </View>
    );
  }

  async setLabel() {
    await this.props.blockchainWallet.save(this.state.address, {
      alias: this.state.alias,
    });
  }

  receiverItem() {
    return (
      <View style={styles.itemContainer}>

        <View style={styles.itemBody}>
          <Text style={styles.label}>Recieve Address</Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>Should this address be your receiver address for Wire & Boost?</Text>
          </View>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          <Switch 
            value={this.state.remote}
            onValueChange={ this.setAsRemote }
            />
        </View>

      </View>
    );
  }

  setAsCurrentAction = async () => {
    this.setState({
      current: true
    });

    await BlockchainWalletService.setCurrent(this.state.address);
    await this.props.blockchainWallet.load(true);
  };

  setAsRemote = async () => {
    this.setState({
      remote: true
    });

    await BlockchainApiService.setWallet(this.state.address);
    await this.props.blockchainWallet.load(true);
  };

  exportItem() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>Export</Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>Download the private key of this wallet</Text>
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

    const url = `data:text/csv;base64,${btoa(privateKey)}`;

    console.log(url);

    await Share.open({
      url
    });
  };

  deleteItem() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>Delete</Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>WARNING: this is irreversable and all tokens will be lost</Text>
          </View>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          {(!this.state.delete && this.state.editable) && <TransparentButton
            style={styles.actionButton}
            color={colors.danger}
            onPress={this.deleteAction}
            title="DELETE"
          />}
        </View>
      </View>
    );
  }

  deleteAction = () => {
    Alert.alert(
      'Are you sure?',
      `This is an IRREVERSIBLE action. If you haven't backed up your private key, you may lose all your funds.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: `Yes, I'm sure`, onPress: () => this.delete() },
      ],
      { cancelable: false }
    );
  };

  async delete() {
    await this.props.blockchainWallet.delete(this.state.address);
    this.props.navigation.goBack();
  }

  import = () => {
    NavigationStoreService.get()
      .dispatch(NavigationActions.navigate({
        routeName: 'BlockchainWalletImport',
        params: {
          address: this.state.address,
          onSuccess: this.importActionReload
        }
      }));
  };

  importActionReload = () => {
    this.setState({
      editable: true,
      edit: false
    });

    this.load(this.state.address);
  };

  importItem() {
    return(
      <View style={styles.itemContainer}>
        <View style={styles.itemBody}>
          <Text style={styles.label}>Import</Text>
          <View style={styles.supportingTextContainer}>
            <Text style={[styles.supportingText, { minWidth: 200 }]}>
              The private key for this wallet does not exist.
            </Text>
          </View>
        </View>

        <View style={styles.itemSpacer}></View>

        <View style={styles.itemActions}>
          {(!this.state.delete) && <TransparentButton
            style={styles.actionButton}
            color={colors.primary}
            onPress={this.import}
            title="IMPORT"
          />}
        </View>
      </View>
    );
  }

  qrCode() {
    return (
      <View>
        <View style={[ CommonStyle.rowJustifyCenter, styles.qrCodeView ]}>
          <QRCode
            value={`ethereum:${this.state.address.toLowerCase()}`}
            size={getQRSize(3 / 4)}
          />
        </View>

        <View style={[ CommonStyle.rowJustifyCenter, styles.qrCodeView ]}>
          <Text style={styles.qrCodeLegend} selectable>{this.state.address.toUpperCase()}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={CommonStyle.backgroundWhite}>

        <View style={[ CommonStyle.flexContainer, { flex: 1 } ]}>

          {!this.state.edit && this.qrCode()}

          {this.balanceItem()}

          {this.receiverItem()}
         
          {this.state.editable && this.labelItem()}

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
    color: colors.darkGreyed,
    fontSize: 12,
  },

  section: {
    paddingTop: 20
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
    color: '#444',
    fontSize: 16,
    fontWeight: '800',
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
    backgroundColor:
    colors.primary,
    borderRadius: 4
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
    fontWeight: '700',
  },
  aliasTextInputReadonly: {
    borderColor: '#f0f0f0'
  },

  qrCodeView: {
    paddingTop: 30
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
    borderRadius: 3
  }
});
