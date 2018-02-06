import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';

import { observer, inject } from 'mobx-react/native'

import { CommonStyle } from "../../styles/Common";

import BlockchainWalletService from './BlockchainWalletService';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ActionSheet from 'react-native-actionsheet';

import BlockchainWalletList from './list/BlockchainWalletList';
import colors from '../../styles/Colors';
import TransparentButton from '../../common/components/TransparentButton';
import debounce from '../../common/helpers/debounce';

addIcon = async () => {
  const icon = await Icon.getImageSource('add', 26);
  return icon;
}

@inject('blockchainWallet', 'blockchainWalletSelector')
@observer
export default class BlockchainWalletScreen extends Component {

  static navigationOptions = ({ navigation }) => {

    const _create = async () => {
      const address = await BlockchainWalletService.create();
      navigation.navigate('BlockchainWalletDetails', { address, new: true })
    }
  
    const _import = () => {
      navigation.navigate('BlockchainWalletImport');
    };
    
    const handleActionSheetSelection = (i) => {
      switch(i) {
        case 1:
          _create();
          break;
        case 2:
          _import();
          break;
      }
    };

    return {
      title: `Wallet Addresses`,
      headerRight: (
        <View style={{ flexDirection: 'row' }}>
          <Icon name="add" size={26} color={colors.primary} style={{paddingRight: 10}} onPress={() => this.ActionSheet.show()} />

          <ActionSheet
            ref={o => this.ActionSheet = o}
            options={[ 'Cancel', 'Create', 'Import' ]}
            onPress={ (i) => { handleActionSheetSelection(i) }}
            cancelButtonIndex={0}
            />
        </View>
        )
  }};

  async componentDidMount() {
    await this.props.blockchainWallet.load(true);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  createAction = () => {
    Alert.alert(
      'Create',
      `Create a new wallet?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => this.create() },
      ],
      { cancelable: false }
    );
  };

  detailsAction = ({ address }) => {
    this.props.navigation.navigate('BlockchainWalletDetails', { address });
  };

  render() {
    return (
      <View style={[ CommonStyle.flexContainer, CommonStyle.backgroundWhite ]}>

        <BlockchainWalletList
          onSelect={this.detailsAction}
          disableCreation={true}
          allowOffchain={true}
        />

      </View>
    );
  }
}

const style = StyleSheet.create({
  actionView: {
    paddingTop: 10,
  },
  actionViewButton: {
    marginTop: 5,
  }
});
