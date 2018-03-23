import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements'

import { inject } from 'mobx-react/native';
import { CommonStyle } from '../../styles/Common';
import { ComponentsStyle } from '../../styles/Components';
import { getRates } from '../BoostService';
import CenteredLoading from '../../common/components/CenteredLoading';

import TypeSelector from './TypeSelector';
import PaymentSelector from './PaymentSelector';
import currency from '../../common/helpers/currency';
import UserTypeahead from '../../common/components/user-typeahead/UserTypeahead';
import Touchable from '../../common/components/Touchable';
import colors from '../../styles/Colors';
import api from '../../common/services/api.service';
import number from '../../common/helpers/number';
import BlockchainBoostService from '../../blockchain/services/BlockchainBoostService';
import Web3Service from '../../blockchain/services/Web3Service';
import BlockchainWalletService from '../../blockchain/wallet/BlockchainWalletService';
import FeaturesService from '../../common/services/features.service';

class VisibleError extends Error {
  visible = true;

  constructor(...args) {
    super(...args);
  }
}


/**
 * Boost Screen
 */
@inject('user', 'checkoutModal')
export default class BoostScreen extends Component {

  textInput = void 0;

  state = {
    // boost
    type: null,
    payment: 'tokens',
    amount: 1000,
    priority: false,
    target: null,
    scheduleTs: null,
    postToFacebook: false,

    // other
    inProgress: false,
    error: '',
    rates: rates = {
      balance: null,
      rate: 1,
      min: 250,
      cap: 5000,
      usd: 1000,
      tokens: 1000,
      minUsd: 1,
      priority: 1
    },
    isSearchingTarget: false,
    allowedTypes: {}
  };

  /**
   * Modal navigation
   */
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={[CommonStyle.backgroundLight, CommonStyle.rowJustifyStart, { paddingTop: 16 }]}>
        <Text style={[styles.titleText, CommonStyle.flexContainer, CommonStyle.padding2x]}>Boost</Text>
        <Icon size={36} name="ios-close" onPress={() => navigation.goBack()} style={CommonStyle.padding2x} />
      </View>
    ),
    transitionConfig: {
      isModal: true
    }
  });

  /**
   * On component will mount
   */
  componentWillMount() {

    if (!FeaturesService.has('crypto')) {
      Alert.alert(
        'Oooopppss',
        'This feature is currently unavailable on your platform',
      );
      return this.props.navigation.goBack();
    }

    getRates()
      .then(rates => {
        this.setState({ rates });
      });
  }

  componentDidMount() {
    this.buildAllowedTypes();
  }

  /**
   * Change Amount
   */
  changeInput = (amount) => {
    if (typeof amount === 'string') {
      amount = amount.replace(/,/g, '');
    }

    if (this.state.type != 'p2p') {
      if (typeof amount === 'string' && amount.substring(amount.length - 1) === '.') {
        // Nothing, since we're inputting numbers, let's keep the dot
      } else if (typeof amount === 'string' && !isNaN(+amount - parseFloat(amount))) {
        amount = `${+amount}`;
      }
    }

    this.setState({ amount });
  };

  parsedAmount() {
    if (!this.state.amount && this.state.amount !== 0) {
      return '';
    }

    if (this.state.type == 'p2p') {
      return `${this.state.amount}` || '0';
    }

    let withDot = false;
    if (typeof this.state.amount === 'string' && this.state.amount.substring(this.state.amount.length - 1) === '.') {
      withDot = true;
    }

    try {
      return `${number(this.state.amount, 0, 4)}` + (withDot ? '.' : '');
    } catch (e) {
      return `${this.state.amount}`;
    }
  }

  /**
   * Change Type
   */
  changeType = (type) => {

    if (this.state.type == type)
      return;

    if (this.state.type == 'p2p') {
      this.setState({
        amount: this.state.amount * this.state.rates.tokens,
      });
    } else if (type == 'p2p') {
      this.setState({
        amount: this.state.amount / this.state.rates.tokens,
      });
    }

    this.setState({ type });

    if (type === 'p2p') {
      this.changePayment('tokens');
    }
  };

  /**
   * Change payment method
   */
  changePayment = (payment) => {
    this.setState({ payment });
  };

  /**
   * Calculate charges including priority
   */
  calcCharges(type) {
    const charges = parseFloat(this.calcBaseCharges(type));
    return charges + (charges * this.getPriorityRate());
  }

  /**
   * Gets the priority rate, only if applicable
   */
  getPriorityRate(force = false) {
    // NOTE: No priority on P2P
    if (force || (this.state.type != 'p2p' && this.state.priority)) {
      return this.state.rates.priority;
    }

    return 0;
  }

  /**
   * Calculate priority charges (for its preview)
   */
  calcPriorityChargesPreview() {
    const value = this.calcBaseCharges(this.state.payment) * this.getPriorityRate(true);
    return currency(!isNaN(value) ? value : 0 , this.state.payment);
  }

  calcBaseCharges(type) {
    // P2P is bid based.
    if (this.state.type === 'p2p') {
      return this.state.amount;
    }

    // Non-P2P should do the views <-> currency conversion
    switch (type) {
      case 'usd':
        const usdFixRate = this.state.rates.usd / 100;
        return Math.ceil(this.state.amount / usdFixRate) / 100;

      case 'tokens':
        const tokensFixRate = this.state.rates.tokens / 10000;
        return Math.ceil(this.state.amount / tokensFixRate) / 10000;
    }

    throw new Error('Unknown currency');
  }

  togglePriority = () => {
    this.setState({priority: !this.state.priority});
  };

  /**
   * Get priority
   */
  getPriority() {
    if (this.state.type === 'p2p') {
      this.state.priority = false;
      return null;
    }

    let text = 'SELECT';
    const style = [CommonStyle.fontM, CommonStyle.marginTop3x];

    if (this.state.priority) {
      text = 'SELECTED';
      style.push(CommonStyle.colorPrimary);
    }

    return (
      <View>
        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]} />

        <Text style={styles.subtitleText}>PRIORITY</Text>

        <Text style={CommonStyle.fontS}>Priority content goes to the front of the line, but costs at least twice the price of a regular boost.</Text>

        <Text style={style} onPress={this.togglePriority}>
          {text} +{this.calcPriorityChargesPreview()}
        </Text>
      </View>
    );
  }

  selectTarget = target => {
    if(target.guid == this.props.user.me.guid) {
      Alert.alert(
        'Error',
        'You cant select yourself to make a p2p boost',
        [
          {text: 'OK', onPress: () => {}},
        ],
        { cancelable: false }
      )
    } else {
      this.setState({
        isSearchingTarget: false,
        target
      });
    }
  };

  TargetPartial = () => {
    if (this.state.type !== 'p2p') {
      return null;
    }

    return (
      <View>
        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]} />

        <Text style={styles.subtitleText}>TARGET</Text>
        <Text style={CommonStyle.fontS}>Search for the channel you want to boost to.</Text>

        <Touchable style={styles.targetView} onPress={() => this.openTargetModal()}>
          { !!this.state.target && <Text style={styles.target}>@{this.state.target.username}</Text> }

          { !!this.state.target && <Text style={styles.changeTarget}>TAP TO CHANGE CHANNEL</Text> }
          { !this.state.target && <Text style={styles.newTarget}>TAP TO SEARCH A CHANNEL</Text> }
        </Touchable>

        <UserTypeahead
          isModalVisible={this.state.isSearchingTarget}
          onSelect={this.selectTarget}
          onClose={() => this.setState({ isSearchingTarget: false })}
        />
      </View>
    );
  };

  openTargetModal() {
    this.setState({ isSearchingTarget: true });
  }

  getAmountValues() {
    return {
      usd: this.calcCharges('usd'),
      tokens: this.calcCharges('tokens')
    };
  }

  buildAllowedTypes() {
    const entity = this.props.navigation.state.params.entity;

    if (!entity || !entity.type) {
      this.setState({});
      return;
    }

    let allowedTypes = {};

    switch (entity.type) {
      case 'activity':
        allowedTypes = {
          newsfeed: true,
          p2p: true
        };

        if (!this.type || this.type === 'content') {
          this.changeType('newsfeed');
        }

        break;

      default:
        allowedTypes = {
          content: true
        };

        if (!this.type || this.type !== 'content') {
          this.changeType('content');
        }

        break;
    }

    this.setState({ allowedTypes })
  }

  // TODO: Move to service

  validate() {
    if (this.state.amount <= 0) {
      throw new Error('Amount should be greater than 0.');
    }

    if (!this.state.type) {
      throw new Error('You should select a type.');
    }

    if (!this.state.payment) {
      throw new Error('You should select a payment method.');
    }

    switch (this.state.payment) {
      case 'usd':
        if (this.calcCharges(this.state.payment) < this.state.rates.minUsd) {
          throw new VisibleError(`You must spend at least ${currency(this.state.rates.minUsd, 'usd')}.`);
        }

        break;
    }

    if (this.state.type === 'p2p') {
      if (!this.state.target) {
        throw new Error('You should select a target.')
      }

      if (!this.state.target.guid == this.props.user.me.guid) {
        throw new VisibleError('Target cant be self.')
      }
    } else /* non-P2P */ {
      if (this.state.amount < this.state.rates.min || this.state.amount > this.state.rates.cap) {
        throw new VisibleError(`You must boost between ${this.state.rates.min} and ${this.state.rates.cap} views.`);
      }
    }
  }

  canSubmit() {
    try {
      this.validate();
      return true;
    } catch (e) { }

    return false;
  }

  showErrors() {
    let error = '';
    try {
      this.validate();
    } catch (e) {
      if (e.visible) {
        error = e.message;
      }
    }

    if (error !== this.state.error) {
      this.setState({ error });
    }
  }

  submit() {
    if (this.state.inProgress) {
      return;
    }

    if (!this.canSubmit()) {
      this.showErrors();
      return;
    }

    Alert.alert(
      'Are you sure?',
      (
        this.state.type !== 'p2p' ?
          `You're about to boost ${number(this.state.amount)} views for your content.` :
          `You're about to send ${currency(this.state.amount, this.state.payment)} to @${this.state.target.username} for reminding your content.`
      ),
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => this._submitBoost() },
      ],
      { cancelable: false }
    );
  }

  async _submitBoost() {
    const entity = this.props.navigation.state.params.entity;

    this.setState({ inProgress: true });
    let guid = null;
    let checksum = ''
    let nonce;

    try {
      if (this.state.payment === 'tokens') {
        const prepared = await this.prepare(entity.guid);

        guid = prepared.guid;
        checksum = prepared.checksum;
      }

      if (this.state.type !== 'p2p') {
        switch (this.state.payment) {
          case 'tokens':
            let payload = await BlockchainWalletService.selectCurrent(`Select the wallet you would like to use for this Network Boost.`, { signable: true, offchain: true, buyable: true });

            if (!payload || payload.cancelled) {
              return;
            }

            const tokensFixRate = this.state.rates.tokens / 10000;
            let amount = Web3Service.web3.utils.toWei(`${Math.ceil(this.state.amount / tokensFixRate) / 10000}`, 'ether').toString();

            switch (payload.type) {
              case 'onchain':
                
		            if (this.state.target && !this.state.target.eth_wallet) {
                  throw new VisibleError('User cannot receive tokens.');
                }

                nonce = {
                  method: 'onchain',
                  txHash: await BlockchainBoostService.create(guid, amount, checksum),
                  address: await Web3Service.getCurrentWalletAddress(true)
                };
                break;

              case 'offchain':
                nonce = {
                  method: 'offchain',
                  address: 'offchain'
                }
                break;

              case 'creditcard':
                nonce = {
                  method: 'creditcard',
                  address: 'creditcard',
                  token: payload.token
                };
                break;

              default:
                throw new Error('Not supported');
                break;
            }
            break;

          case 'usd':
            const token = await this.props.checkoutModal.show();

            if (!token) {
              return;
            }

            nonce = token;
            break;

          default:
            throw new Error('Not supported');
        }

        await api.post(`api/v2/boost/${entity.type}/${entity.guid}/${entity.owner_guid}`, {
          guid,
          bidType: this.state.payment,
          impressions: this.state.amount,
          priority: this.state.priority ? 1 : null,
          paymentMethod: nonce,
          checksum
        });
      } else /* P2P */ {
        let amount = this.state.amount;

        switch (this.state.payment) {
          case 'tokens':
            let payload = await BlockchainWalletService.selectCurrent(`Select the wallet you would like to use for this Channel Boost.`, { signable: true, offchain: true, buyable: true });

            if (!payload || payload.cancelled) {
              return;
            }

            amount = Web3Service.web3.utils.toWei(`${this.state.amount}`, 'ether').toString();

            switch (payload.type) {
              case 'onchain':
                if (!this.state.target.eth_wallet) {
                  throw new VisibleError('Boost target should have a Receiver Address.');
                }

                nonce = {
                  method: 'onchain',
                  txHash: await BlockchainBoostService.createPeer(this.state.target.eth_wallet, guid, amount, checksum),
                  address: await Web3Service.getCurrentWalletAddress(true)
                };
                break;

              case 'offchain':
                if (!this.state.target.rewards) {
                  throw new VisibleError('Boost target should participate in the Rewards program.');
                }

                nonce = {
                  method: 'offchain',
                  address: 'offchain'
                }
                break;

              case 'creditcard':
                if (!this.state.target.rewards) {
                  throw new VisibleError('Boost target should participate in the Rewards program.');
                }

                nonce = {
                  method: 'creditcard',
                  address: 'creditcard',
                  token: payload.token
                };
                break;

              default:
                throw new Error('Not supported');
                break;
            }
            break;

          default:
            throw new Error('Not supported');
        }

        await api.post(`api/v2/boost/peer/${entity.guid}/${entity.owner_guid}`, {
          guid,
          currency: this.state.payment,
          paymentMethod: nonce,
          bid: amount,
          destination: this.state.target.guid,
          scheduleTs: this.state.scheduleTs,
          postToFacebook: this.state.postToFacebook ? 1 : null,
          checksum
        });
      }

      this.props.navigation.goBack();
    } catch (e) {
      if (!e || e.message !== 'E_CANCELLED') {
        let error;

        if (e && e.stage === 'transaction') {
          error = 'Sorry, your payment failed. Please, try again, use another card or wallet';
        } else {
          error = (e && e.message) || 'Sorry, something went wrong';
        }

        this.setState({ error });
        console.warn(e);
      }
    } finally {
      this.setState({ inProgress: false });
    }
  }

  async prepare(entityGuid) {
    const { guid, checksum } =
      (await api.get(`api/v2/boost/prepare/${entityGuid}`)) || {};

    if (!guid) {
      throw new Error('Cannot generate GUID');
    }

    return { guid, checksum };
  }

  //

  /**
   * Render
   */
  render() {
    if (!this.state.rates) {
      return <CenteredLoading/>
    }

    let amountTitle = 'HOW MANY VIEWS DO YOU WANT?';

    if (this.state.type === 'p2p') {
      amountTitle = 'WHAT\'S YOUR OFFER ?';
    }

    const PriorityPartial = this.getPriority();

    return (
      <ScrollView style={[CommonStyle.flexContainer, CommonStyle.backgroundLight, CommonStyle.padding2x]}>
        <Text style={[styles.subtitleText, CommonStyle.paddingBottom]}>BOOST TYPE</Text>
        <TypeSelector onChange={this.changeType} value={this.state.type} allowedTypes={this.state.allowedTypes} />

        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}/>

        <Text style={styles.subtitleText}>{amountTitle}</Text>
        <View style={[CommonStyle.rowJustifyStart, CommonStyle.alignCenter, CommonStyle.paddingTop]}>
          <TextInput 
            ref={textInput => this.textInput = textInput}
            placeholder="0"
            onChangeText={this.changeInput}
            style={styles.input}
            underlineColorAndroid="transparent"
            value={this.parsedAmount()}
            keyboardType="numeric" 
            />
          { this.state.type !== 'p2p' && <Text style={[CommonStyle.fontXXL, CommonStyle.paddingLeft2x]}>Views</Text> }
        </View>

        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]} />

        <Text style={styles.subtitleText}>COST</Text>
        <PaymentSelector onChange={this.changePayment} value={this.state.payment} type={this.state.type} values={this.getAmountValues()} />

        {PriorityPartial}

        {this.TargetPartial()}

        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]} />

        { !!this.state.error && <Text style={styles.error}>
          {this.state.error}
        </Text>}

        <View style={{ flexDirection: 'row' }}>
          <Touchable style={[ComponentsStyle.button, ComponentsStyle.buttonAction, { backgroundColor: 'transparent' }, CommonStyle.marginTop2x, CommonStyle.marginBottom3x]}
            onPress={() => this.submit()}
          >
            <Text style={CommonStyle.colorPrimary}>BOOST</Text>
          </Touchable>
          <View style={{ flex: 1 }}></View>
        </View>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  typeSelectorText: {
    fontSize: 16,
    textAlign: 'left'
  },
  typeSelectorSelectedText: {
    fontSize: 20,
    textAlign: 'left'
  },
  selectorText: {
    fontSize: 24
  },
  titleText: {
    fontSize: 28
  },
  subtitleText: {
    fontSize: 15,
    textAlign: 'left',
    paddingBottom: 5
  },
  centered: {
    textAlign: 'center'
  },
  input: {
    fontSize: 50,
    color: '#666',
    width: '50%',
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 0,
    paddingHorizontal: 5,
    textAlign: 'right',
  },
  targetView: {
    paddingTop: 10,
    paddingBottom: 10
  },
  target: {
    marginBottom: 5,
    fontSize: 20
  },
  newTarget: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14
  },
  changeTarget: {
    color: colors.greyed,
    fontSize: 12
  },
  error: {
    color: '#c00',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    marginBottom:10
  }
});
