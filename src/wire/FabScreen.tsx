import React, { Component, Fragment } from 'react';

import {
  Text,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../styles/Colors';
import { CommonStyle as CS } from '../styles/Common';
import featuresService from '../common/services/features.service';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import SubscriptionTierCarousel from './tiers/SubscriptionTierCarousel';
import PaymentMethodSelector from './methods/PaymentMethodSelector';
import BtcPayment from './methods/BtcPayment';
import Button from '../common/components/Button';
import StripeCardSelector from './methods/StripeCardSelector';
import ThemedStyles from '../styles/ThemedStyles';

import type { RootStackParamList } from '../navigation/NavigationTypes';
import type WalletStore from '../wallet/WalletStore';
import type WireStore from '../wire/WireStore';
import type { StripeCard } from './WireTypes';
import { SafeAreaConsumer } from 'react-native-safe-area-context';

type FabScreenRouteProp = RouteProp<RootStackParamList, 'Fab'>;
type FabcreenNavigationProp = StackNavigationProp<RootStackParamList, 'Fab'>;

type PropsType = {
  navigation: FabcreenNavigationProp;
  wallet: WalletStore;
  wire: WireStore;
  route: FabScreenRouteProp;
};

/**
 * Wire Fab Screen
 */
@inject('wallet', 'wire')
@observer
class FabScreen extends Component<PropsType> {
  /**
   * constructor
   */
  constructor(props: PropsType) {
    super(props);

    if (!featuresService.has('crypto')) {
      featuresService.showAlert();
      this.props.navigation.goBack();
      return;
    }

    this.loadUserAndSetDefaults();

    this.props.wallet.refresh();
  }

  componentWillUnmount() {
    this.props.wire.setOwner(null);
  }

  async loadUserAndSetDefaults() {
    const params = this.props.route.params;

    // if there is no default data we reset the store
    if (!params || !params.default) {
      this.props.wire.reset();
    }

    const owner = this.getOwner();

    this.props.wire.setOwner(owner);

    await this.props.wire.loadUserRewards();

    this.setDefaults();
  }

  setDefaults() {
    const params = this.props.route.params;
    const wire = this.props.wire;
    const owner = wire.owner;

    if (params.default) {
      wire.setAmount(params.default.min);

      if (
        !params.disableThresholdCheck &&
        owner &&
        owner.sums &&
        owner.sums[params.default.type]
      ) {
        wire.setAmount(
          wire.amount - Math.ceil(owner.sums[params.default.type]),
        );
      }
    }

    if (wire.amount < 0) {
      wire.setAmount(0);
    }
  }

  getOwner() {
    return this.props.route.params.owner;
  }

  onCancelBtc = () => {
    this.props.wire.setShowBtc(false);
  };

  onSelectCard = (card: StripeCard) => {
    this.props.wire.setPaymentMethodId(card.id);
  };

  goBackUSD = () => {
    this.props.wire.setShowCardselector(false);
  };

  getBody() {
    const buttonDisabled =
      this.props.wire.sending || this.props.wire.errors.length > 0;

    if (!this.props.wire.owner) {
      return null;
    }

    if (
      this.props.wire.showBtc &&
      this.props.wire.owner &&
      this.props.wire.owner.btc_address
    ) {
      return (
        <BtcPayment
          amount={this.props.wire.amount}
          address={this.props.wire.owner.btc_address}
          onCancel={this.onCancelBtc}
        />
      );
    }

    if (this.props.wire.showCardselector) {
      return (
        <View style={CS.columnAlignCenter}>
          <Text
            style={[
              CS.marginTop2x,
              CS.fontHairline,
              CS.fontXL,
              CS.marginBottom2x,
            ]}>
            {i18n.t('wire.selectCredit')}
          </Text>
          <StripeCardSelector onCardSelected={this.onSelectCard} />

          <View style={[CS.rowJustifyCenter, CS.paddingTop3x, CS.marginTop4x]}>
            <Button
              text={i18n.t('goback').toUpperCase()}
              disabled={buttonDisabled || !this.props.wire.paymentMethodId}
              onPress={this.goBackUSD}
              textStyle={[CS.fontL, CS.padding]}
            />
            <Button
              text={i18n.t('send').toUpperCase()}
              disabled={buttonDisabled || !this.props.wire.paymentMethodId}
              onPress={this.confirmSend}
              textStyle={[CS.fontL, CS.padding]}
              inverted
            />
          </View>
        </View>
      );
    }

    const owner = this.getOwner();
    const txtAmount = this.getTextAmount();
    const amount = this.props.wire.amount;

    return (
      <Fragment>
        <Text style={[CS.fontL, CS.textCenter, CS.marginTop2x]}>
          {i18n.to(
            'wire.supportMessage',
            {
              payments: featuresService.has('wire-multi-currency')
                ? 'tokens , ETH, BTC or USD'
                : 'tokens',
            },
            {
              name: <Text style={CS.bold}>@{owner.username}</Text>,
            },
          )}
        </Text>

        {Platform.OS !== 'ios' ? (
          <View style={[CS.paddingBottom, CS.paddingTop3x]}>
            {this.props.wire.owner.wire_rewards.rewards && (
              <SubscriptionTierCarousel
                amount={amount}
                rewards={this.props.wire.owner.wire_rewards.rewards}
                currency={this.props.wire.currency}
                recurring={this.props.wire.recurring}
                onTierSelected={this.props.wire.setTier}
              />
            )}
          </View>
        ) : undefined}

        <View style={(CS.marginTop3x, CS.marginBottom2x)}>
          {this.props.wire.errors.map((e) => (
            <Text style={[CS.colorDanger, CS.fontM, CS.textCenter]}>{e}</Text>
          ))}
        </View>

        <PaymentMethodSelector
          value={this.props.wire.currency}
          onSelect={this.props.wire.setCurrency}
        />

        <View
          style={[
            CS.rowJustifySpaceEvenly,
            CS.marginBottom3x,
            CS.marginTop3x,
            CS.alignJustifyCenter,
            CS.alignCenter,
          ]}>
          <TextInput
            onChangeText={this.changeInput}
            style={[
              CS.field,
              CS.fontXXXL,
              CS.backgroundLight,
              CS.padding3x,
              CS.textRight,
              CS.flexContainer,
              CS.borderRadius5x,
              CS.border,
              CS.borderLightGreyed,
            ]}
            underlineColorAndroid="transparent"
            value={amount.toString()}
            keyboardType="numeric"
          />
        </View>

        <View>
          {['usd', 'tokens'].includes(this.props.wire.currency) ? (
            <CheckBox
              title={i18n.t('wire.repeatMessage')}
              checked={this.props.wire.recurring}
              onPress={() => this.props.wire.toggleRecurring()}
              //@ts-ignore
              left
              checkedIcon="check-circle-o"
              checkedColor={colors.primary}
              uncheckedIcon="circle-o"
              uncheckedColor={colors.greyed}
              textStyle={ThemedStyles.style.colorPrimaryText}
              containerStyle={[
                CS.noBorder,
                ThemedStyles.style.backgroundTransparent,
              ]}
            />
          ) : (
            <Text
              style={[
                CS.fontM,
                CS.textCenter,
                CS.marginTop2x,
                CS.marginBottom2x,
              ]}>
              {i18n.t('wire.willNotRecur', {
                currency: this.props.wire.currency.toUpperCase(),
              })}
            </Text>
          )}
        </View>

        {this.props.wire.owner.wire_rewards &&
          this.props.wire.owner.wire_rewards.length && (
            <View>
              <Text>{i18n.t('wire.nameReward', { name: owner.username })}</Text>
              <Text>
                {i18n.to('wire.youHaveSent', null, {
                  amount: <Text style={CS.bold}>{txtAmount}</Text>,
                })}
              </Text>
            </View>
          )}

        <Button
          text={
            this.props.wire.amount === 0
              ? i18n.t('ok').toUpperCase()
              : i18n.t('send').toUpperCase()
          }
          disabled={buttonDisabled}
          onPress={this.confirmSend}
          textStyle={[CS.fontL, CS.padding]}
        />
      </Fragment>
    );
  }

  /**
   * Render screen
   */
  render() {
    // sending?
    let icon;
    if (this.props.wire.sending) {
      icon = <ActivityIndicator size={'large'} color={colors.primary} />;
    } else {
      icon = (
        <Icon
          size={64}
          name="ios-flash"
          style={[ThemedStyles.style.colorIconActive, CS.paddingBottom2x]}
        />
      );
    }

    const body = !this.props.wire.loaded ? (
      <ActivityIndicator size={'large'} color={colors.primary} />
    ) : (
      this.getBody()
    );

    return (
      <SafeAreaConsumer>
        {(insets) => (
          <ScrollView
            contentContainerStyle={[
              ThemedStyles.style.backgroundSecondary,
              CS.paddingLeft2x,
              CS.paddingRight2x,
              CS.columnAlignCenter,
              CS.alignCenter,
              CS.flexContainer,
              CS.paddingTop2x,
            ]}
            style={[CS.flexContainer, { paddingTop: insets!.top }]}>
            <Icon
              size={45}
              name="ios-close"
              onPress={() => this.props.navigation.goBack()}
              style={[
                CS.marginRight3x,
                CS.marginTop3x,
                CS.positionAbsoluteTopRight,
                ThemedStyles.style.colorIcon,
              ]}
            />
            {icon}
            {body}
          </ScrollView>
        )}
      </SafeAreaConsumer>
    );
  }

  confirmSend = () => {
    // is 0 just we execute complete
    if (this.props.wire.amount == 0) {
      const onComplete = this.props.route.params.onComplete;
      if (onComplete) onComplete();
      this.props.navigation.goBack();
      return;
    }

    // we only show the btc component
    if (this.props.wire.currency === 'btc') {
      return this.send();
    }

    if (
      this.props.wire.currency === 'usd' &&
      !this.props.wire.showCardselector
    ) {
      return this.props.wire.setShowCardselector(true);
    }

    if (!this.props.wire.owner) {
      Alert.alert('Receiver user is undefined');
      return;
    }

    Alert.alert(
      i18n.t('confirmMessage'),
      i18n.t('wire.confirmMessage', {
        amount: this.props.wire.formatAmount(this.props.wire.amount),
        name: this.props.wire.owner.username,
      }),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('ok'), onPress: () => this.send() },
      ],
      { cancelable: false },
    );
  };

  /**
   * Call send and go back on success
   */
  async send() {
    const onComplete = this.props.route.params.onComplete;
    try {
      let done = await this.props.wire.send();

      if (!done) {
        return;
      }

      if (onComplete) onComplete(done);
      this.props.navigation.goBack();
    } catch (e) {
      if (!e || e.message !== 'E_CANCELLED') {
        logService.error(e);

        Alert.alert(
          i18n.t('wire.errorSendingWire'),
          (e && e.message) || 'Unknown internal error',
          [{ text: i18n.t('ok') }],
          { cancelable: false },
        );
      }
    }
  }

  /**
   * Get formated amount of last month sum
   */
  getTextAmount() {
    if (!this.props.wire.owner) {
      return '0';
    }
    return this.props.wire.formatAmount(this.props.wire.owner.sums.tokens);
  }

  changeInput = (val: string) => {
    if (val !== '') {
      val = val.replace(',', '.');
      val = val.replace('..', '.');
      val = val.replace('/(?<=w).(?=w+.)|Gw+K./g', '');
    }
    this.props.wire.setAmount(parseFloat(val));
  };
}

export default FabScreen;
