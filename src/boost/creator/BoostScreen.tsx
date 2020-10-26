//@ts-nocheck
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';

import { inject } from 'mobx-react';
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
import readableError from '../../common/helpers/readable-error';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

class VisibleError extends Error {
  visible = true;

  constructor(...args) {
    super(...args);
  }
}

/**
 * Boost Screen
 */
@inject('user')
export default class BoostScreen extends Component {
  textInput = void 0;

  state = {
    // boost
    type: null,
    payment: 'tokens',
    amount: 1000,
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
      priority: 1,
    },
    isSearchingTarget: false,
    allowedTypes: {},
  };

  componentDidMount() {
    if (!FeaturesService.has('crypto')) {
      FeaturesService.showAlert();
      return this.props.navigation.goBack();
    }

    getRates().then((rates) => {
      this.setState({ rates });
    });

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
      if (
        typeof amount === 'string' &&
        amount.substring(amount.length - 1) === '.'
      ) {
        // Nothing, since we're inputting numbers, let's keep the dot
      } else if (
        typeof amount === 'string' &&
        !isNaN(+amount - parseFloat(amount))
      ) {
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
    if (
      typeof this.state.amount === 'string' &&
      this.state.amount.substring(this.state.amount.length - 1) === '.'
    ) {
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
    if (this.state.type == type) return;

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
   * Calculate charges
   */
  calcCharges(type) {
    const charges = parseFloat(this.calcBaseCharges(type));
    return charges;
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

  selectTarget = (target) => {
    if (target.guid == this.props.user.me.guid) {
      Alert.alert(
        i18n.t('error'),
        i18n.t('boosts.youCantSelectYourself'),
        [{ text: 'OK', onPress: () => {} }],
        { cancelable: false },
      );
    } else {
      this.setState({
        isSearchingTarget: false,
        target,
      });
    }
  };

  TargetPartial = () => {
    if (this.state.type !== 'p2p') {
      return null;
    }

    return (
      <View>
        <Divider
          style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}
        />

        <Text style={styles.subtitleText}>{i18n.t('boosts.target')}</Text>
        <Text style={CommonStyle.fontS}>
          {i18n.t('boosts.targetDescription')}
        </Text>

        <Touchable
          style={styles.targetView}
          onPress={() => this.openTargetModal()}>
          {!!this.state.target && (
            <Text style={styles.target}>@{this.state.target.username}</Text>
          )}

          {!!this.state.target && (
            <Text style={styles.changeTarget}>
              {i18n.t('boosts.tapToChangeChannel')}
            </Text>
          )}
          {!this.state.target && (
            <Text style={styles.newTarget}>
              {i18n.t('boosts.tapToSearchChannel')}
            </Text>
          )}
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
      tokens: this.calcCharges('tokens'),
    };
  }

  buildAllowedTypes() {
    const entity = this.props.route.params.entity;

    if (!entity || !entity.type) {
      this.setState({});
      return;
    }

    let allowedTypes = {};

    switch (entity.type) {
      case 'activity':
        allowedTypes = {
          newsfeed: true,
          p2p: true,
        };

        if (!this.type || this.type === 'content') {
          this.changeType('newsfeed');
        }

        break;

      default:
        allowedTypes = {
          content: true,
        };

        if (!this.type || this.type !== 'content') {
          this.changeType('content');
        }

        break;
    }

    this.setState({ allowedTypes });
  }

  // TODO: Move to service

  validate() {
    if (this.state.amount <= 0) {
      throw new Error(i18n.t('boosts.errorAmountSholdbePositive'));
    }

    if (!this.state.type) {
      throw new Error(i18n.t('boosts.errorShouldSelectType'));
    }

    if (!this.state.payment) {
      throw new Error(i18n.t('boosts.errorShouldSelectMethod'));
    }

    switch (this.state.payment) {
      case 'usd':
        if (this.calcCharges(this.state.payment) < this.state.rates.minUsd) {
          throw new VisibleError(
            i18n.t('boosts.errorShouldSpendAtLeast', {
              amount: currency(this.state.rates.minUsd, 'usd'),
            }),
          );
        }

        break;
    }

    if (this.state.type === 'p2p') {
      if (!this.state.target) {
        throw new Error(i18n.t('boosts.errorShouldSelectTarget'));
      }

      if (!this.state.target.guid == this.props.user.me.guid) {
        throw new VisibleError(i18n.t('boosts.errorTargetSelf'));
      }
    } /* non-P2P */ else {
      if (
        this.state.amount < this.state.rates.min ||
        this.state.amount > this.state.rates.cap
      ) {
        throw new VisibleError(
          i18n.t('boosts.errorBetween', {
            min: this.state.rates.min,
            max: this.state.rates.cap,
          }),
        );
      }
    }
  }

  canSubmit() {
    try {
      this.validate();
      return true;
    } catch (e) {}

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
      i18n.t('confirmMessage'),
      this.state.type !== 'p2p'
        ? i18n.t('boosts.boostConfirm', { amount: number(this.state.amount) })
        : i18n.t('boosts.boostConfirmP2p', {
            amount: currency(this.state.amount, this.state.payment),
            username: this.state.target.username,
          }),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('ok'), onPress: () => this._submitBoost() },
      ],
      { cancelable: false },
    );
  }

  async _submitBoost() {
    const entity = this.props.route.params.entity;

    this.setState({ inProgress: true });
    let guid = null;
    let checksum = '';
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
            let payload = await BlockchainWalletService.selectCurrent(
              i18n.t('boosts.selectWalletNetworkMessage'),
              {
                signable: true,
                offchain: true,
                buyable: true,
                currency: 'tokens',
              },
            );

            if (!payload || payload.cancelled) {
              return;
            }

            const tokensFixRate = this.state.rates.tokens / 10000;
            let amount = Web3Service.web3.utils
              .toWei(
                `${Math.ceil(this.state.amount / tokensFixRate) / 10000}`,
                'ether',
              )
              .toString();

            switch (payload.type) {
              case 'onchain':
                if (this.state.target && !this.state.target.eth_wallet) {
                  throw new VisibleError(
                    i18n.t('boosts.errorCantReceiveTokens'),
                  );
                }

                nonce = {
                  method: 'onchain',
                  txHash: await BlockchainBoostService.create(
                    guid,
                    amount,
                    checksum,
                  ),
                  address: await Web3Service.getCurrentWalletAddress(true),
                };
                break;

              case 'offchain':
                nonce = {
                  method: 'offchain',
                  address: 'offchain',
                };
                break;

              case 'creditcard':
                nonce = {
                  method: 'creditcard',
                  address: 'creditcard',
                  token: payload.token,
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

        await api.post(
          `api/v2/boost/${entity.type}/${entity.guid}/${entity.owner_guid}`,
          {
            guid,
            bidType: this.state.payment,
            impressions: this.state.amount,
            paymentMethod: nonce,
            checksum,
          },
        );
      } /* P2P */ else {
        let amount = this.state.amount;

        switch (this.state.payment) {
          case 'tokens':
            let payload = await BlockchainWalletService.selectCurrent(
              i18n.t('boosts.selectWalletChannelMessage'),
              {
                signable: true,
                offchain: true,
                buyable: true,
                currency: 'tokens',
              },
            );

            if (!payload || payload.cancelled) {
              return;
            }

            amount = Web3Service.web3.utils
              .toWei(`${this.state.amount}`, 'ether')
              .toString();

            switch (payload.type) {
              case 'onchain':
                if (!this.state.target.eth_wallet) {
                  throw new VisibleError(
                    i18n.t('boosts.errorShouldHaveReceiverAddress'),
                  );
                }

                nonce = {
                  method: 'onchain',
                  txHash: await BlockchainBoostService.createPeer(
                    this.state.target.eth_wallet,
                    guid,
                    amount,
                    checksum,
                  ),
                  address: await Web3Service.getCurrentWalletAddress(true),
                };
                break;

              case 'offchain':
                if (!this.state.target.rewards) {
                  throw new VisibleError(
                    i18n.t('boosts.errorShouldParticipateRewards'),
                  );
                }

                nonce = {
                  method: 'offchain',
                  address: 'offchain',
                };
                break;

              case 'creditcard':
                if (!this.state.target.rewards) {
                  throw new VisibleError(
                    i18n.t('boosts.errorShouldParticipateRewards'),
                  );
                }

                nonce = {
                  method: 'creditcard',
                  address: 'creditcard',
                  token: payload.token,
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

        await api.post(
          `api/v2/boost/peer/${entity.guid}/${entity.owner_guid}`,
          {
            guid,
            currency: this.state.payment,
            paymentMethod: nonce,
            bid: amount,
            destination: this.state.target.guid,
            scheduleTs: this.state.scheduleTs,
            postToFacebook: this.state.postToFacebook ? 1 : null,
            checksum,
          },
        );
      }

      this.props.navigation.goBack();
    } catch (e) {
      if (!e || e.message !== 'E_CANCELLED') {
        let error;

        if (e && e.stage === 'transaction') {
          error = i18n.t('boosts.errorPayment');
        } else {
          error = (e && e.message) || i18n.t('errorMessage');
        }

        this.setState({ error: readableError(error) });
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
      throw new Error(i18n.t('boosts.errorCanNotGenerate'));
    }

    return { guid, checksum };
  }

  //

  /**
   * Render
   */
  render() {
    if (!this.state.rates) {
      return <CenteredLoading />;
    }

    let amountTitle = i18n.t('boosts.howManyViewsDoYouWant');

    if (this.state.type === 'p2p') {
      amountTitle = i18n.t('boosts.whatIsYourOffer');
    }

    const theme = ThemedStyles.style;

    return (
      <ScrollView
        style={[
          CommonStyle.flexContainer,
          theme.backgroundSecondary,
          CommonStyle.padding2x,
        ]}>
        <Text style={[styles.subtitleText, CommonStyle.paddingBottom]}>
          {i18n.t('boosts.boostType')}
        </Text>
        <TypeSelector
          onChange={this.changeType}
          value={this.state.type}
          allowedTypes={this.state.allowedTypes}
        />

        <Divider
          style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}
        />

        <Text style={styles.subtitleText}>{amountTitle}</Text>
        <View
          style={[
            CommonStyle.rowJustifyStart,
            CommonStyle.alignCenter,
            CommonStyle.paddingTop,
          ]}>
          <TextInput
            ref={(textInput) => (this.textInput = textInput)}
            placeholder="0"
            onChangeText={this.changeInput}
            style={styles.input}
            underlineColorAndroid="transparent"
            value={this.parsedAmount()}
            keyboardType="numeric"
          />
          {this.state.type !== 'p2p' && (
            <Text style={[CommonStyle.fontXXL, CommonStyle.paddingLeft2x]}>
              {i18n.t('views')}
            </Text>
          )}
        </View>

        <Divider
          style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}
        />

        <Text style={styles.subtitleText}>{i18n.t('boosts.cost')}</Text>
        <PaymentSelector
          onChange={this.changePayment}
          value={this.state.payment}
          type={this.state.type}
          values={this.getAmountValues()}
        />

        {this.TargetPartial()}

        <Divider
          style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}
        />

        {!!this.state.error && (
          <Text style={styles.error}>{this.state.error}</Text>
        )}

        <View style={{ flexDirection: 'row' }}>
          <Touchable
            style={[
              ComponentsStyle.button,
              ComponentsStyle.buttonAction,
              { backgroundColor: 'transparent' },
              CommonStyle.marginTop2x,
              CommonStyle.marginBottom3x,
            ]}
            onPress={() => this.submit()}>
            <Text style={CommonStyle.colorPrimary}>
              {i18n.t('boost').toUpperCase()}
            </Text>
          </Touchable>
          <View style={{ flex: 1 }}></View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  typeSelectorText: {
    fontSize: 16,
    textAlign: 'left',
  },
  typeSelectorSelectedText: {
    fontSize: 20,
    textAlign: 'left',
  },
  selectorText: {
    fontSize: 24,
  },
  titleText: {
    fontSize: 28,
  },
  subtitleText: {
    fontSize: 15,
    textAlign: 'left',
    paddingBottom: 5,
  },
  centered: {
    textAlign: 'center',
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
    paddingBottom: 10,
  },
  target: {
    marginBottom: 5,
    fontSize: 20,
  },
  newTarget: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  changeTarget: {
    fontSize: 12,
  },
  error: {
    color: '#c00',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});
