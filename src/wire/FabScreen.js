import React, {
  Component, Fragment
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';

import { CheckBox } from 'react-native-elements'

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../styles/Colors';
import { CommonStyle as CS } from '../styles/Common';

import RewardsCarousel from '../channel/carousel/RewardsCarousel';

import featuresService from '../common/services/features.service';
import number from '../common/helpers/number';
import token from '../common/helpers/token';
import addressExcerpt from '../common/helpers/address-excerpt';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import SubscriptionTierCarousel from './tiers/SubscriptionTierCarousel';
import PaymentMethodSelector from './methods/PaymentMethodSelector';
import BtcPayment from './methods/BtcPayment';
import PaymentMethodIcon from './methods/PaymentMethodIcon';
import Button from '../common/components/Button';
import numberFromat from '../common/helpers/number';
import StripeCardSelector from './methods/StripeCardSelector';

/**
 * Wire Fab Screen
 */
@inject('wire')
@inject('wallet')
@observer
export default class FabScreen extends Component {

  componentWillMount() {

    this.paymethodRef = React.createRef();

    if (!featuresService.has('crypto')) {
      featuresService.showAlert();
      return this.props.navigation.goBack();
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
    const params = this.props.navigation.state.params;
    const wire = this.props.wire;
    const owner = wire.owner;

    if (params.default) {
      wire.setAmount(params.default.min);

      if (!params.disableThresholdCheck && owner.sums && owner.sums[params.default.type]) {
        wire.setAmount(wire.amount - Math.ceil(owner.sums[params.default.type]));
      }
    }

    if (wire.amount < 0) {
      wire.setAmount(0);
    }
  }

  getOwner() {
    return this.props.navigation.state.params.owner;
  }

  /**
   * Modal navigation
   */
  static navigationOptions = ({ navigation }) => ({
    header: null,
    transitionConfig: {
      isModal: true
    }
  });

  selectMethod = () => {
    if (this.paymethodRef.current) {
      this.paymethodRef.current.show();
    }
  }

  onCancelBtc = () => {
    this.props.wire.setShowBtc(false);
  }

  onSelectCard = (card) => {
    this.props.wire.setPaymentMethodId(card.id);
  }

  goBackUSD = () => {
    this.props.wire.setShowCardselector(false)
  }

  getBody() {
    const buttonDisabled = this.props.wire.sending || this.props.wire.errors.length > 0;

    if (this.props.wire.showBtc) {
      return (
        <BtcPayment amount={this.props.wire.amount} address={this.props.wire.owner.btc_address} onCancel={this.onCancelBtc}/>
      )
    }

    if (this.props.wire.showCardselector) {
      return (
        <View style={CS.columnAlignCenter}>
          <Text style={[CS.marginTop2x, CS.fontHairline, CS.fontXL, CS.marginBottom2x]}>{i18n.t('wire.selectCredit')}</Text>
          <StripeCardSelector onCardSelected={this.onSelectCard}/>

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
      )
    }

    const owner = this.getOwner();
    const txtAmount = this.getTextAmount();
    const amount = this.props.wire.amount.toString();

    return (
      <Fragment>
        <Text style={[CS.fontL, CS.textCenter, CS.marginTop2x]}>{i18n.to('wire.supportMessage', {payments: featuresService.has('wire-multi-currency') ? 'tokens , ETH, BTC or USD' : 'tokens' }, {
          name: <Text style={CS.bold}>@{ owner.username }</Text>
        })}</Text>

        <View style={[CS.paddingBottom, CS.paddingTop3x]}>
          {this.props.wire.owner.wire_rewards.rewards && <SubscriptionTierCarousel
            amount={amount}
            rewards={this.props.wire.owner.wire_rewards.rewards}
            currency={this.props.wire.currency}
            recurring={this.props.wire.recurring}
            onTierSelected={this.props.wire.setTier}
          />}
        </View>

        <View style={CS.marginTop3x, CS.marginBottom2x}>
          {this.props.wire.errors.map(e => <Text style={[CS.colorDanger, CS.fontM, CS.textCenter]}>{e}</Text>)}
        </View>

        <PaymentMethodSelector
          ref={this.paymethodRef}
          value={this.props.wire.currency}
          onSelect={this.props.wire.setCurrency}
        />

        <View style={[CS.rowJustifySpaceEvenly, CS.marginBottom3x, CS.marginTop3x, CS.alignJustifyCenter, CS.alignCenter]}>

          <TextInput

            ref="input"
            onChangeText={this.changeInput}
            style={[CS.field, CS.fontXXXL, CS.backgroundLight, CS.padding3x, CS.textRight, CS.flexContainer, CS.borderRadius5x, CS.border, CS.borderLightGreyed]}
            underlineColorAndroid="transparent"
            value={amount}
            keyboardType="numeric"
          />
        </View>

        <View>
          { ['usd','tokens'].includes(this.props.wire.currency) ?
            <CheckBox
              title={i18n.t('wire.repeatMessage')}
              checked={this.props.wire.recurring}
              onPress={() => this.props.wire.toggleRecurring()}
              left
              checkedIcon="check-circle-o"
              checkedColor={ colors.primary }
              uncheckedIcon="circle-o"
              uncheckedColor={ colors.greyed }
              containerStyle={[CS.backgroundWhite, CS.noBorder]}
            />:
            <Text style={[CS.fontM, CS.textCenter, CS.marginTop2x, CS.marginBottom2x]}>{i18n.t('wire.willNotRecur', {currency: this.props.wire.currency.toUpperCase()})}</Text>
          }
        </View>

        { this.props.wire.owner.wire_rewards && this.props.wire.owner.wire_rewards.length && <View>
          <Text style={styles.rewards}>{i18n.t('wire.nameReward',{name: owner.username})}</Text>
          <Text style={styles.lastmonth}>{i18n.to('wire.youHaveSent', null, {amount: <Text style={styles.bold}>{txtAmount}</Text>})}</Text>
          </View> }

        <Button
          text={(this.props.wire.amount == 0) ? i18n.t('ok').toUpperCase() : i18n.t('send').toUpperCase()}
          disabled={buttonDisabled}
          onPress={this.confirmSend}
          textStyle={[CS.fontL, CS.padding]}
          inverted
        />
      </Fragment>
    )
  }

  /**
   * Render screen
   */
  render() {
    // sending?
    let icon;
    if (this.props.wire.sending) {
      icon = <ActivityIndicator size={'large'} color={colors.primary}/>
    } else {
      icon = <Icon size={64} name="ios-flash" style={[CS.colorPrimary, CS.paddingBottom2x]} />
    }

    const body = !this.props.wire.loaded ? <ActivityIndicator size={'large'} color={colors.primary}/> : this.getBody();

    return (
      <ScrollView contentContainerStyle={[CS.backgroundWhite, CS.paddingLeft2x, CS.paddingRight2x, CS.columnAlignCenter, CS.alignCenter, CS.flexContainer, CS.paddingTop2x]}>
        <Icon size={40} name="ios-close" onPress={() => this.props.navigation.goBack()} style={[CS.marginRight3x, CS.marginTop3x, CS.positionAbsoluteTopRight]}/>
        {icon}
        {body}
      </ScrollView>
    );
  }

  confirmSend = () => {
    // is 0 just we execute complete
    if (this.props.wire.amount == 0) {
      const onComplete = this.props.navigation.state.params.onComplete;
      if (onComplete) onComplete();
      this.props.navigation.goBack();
      return;
    }

    // we only show the btc component
    if (this.props.wire.currency === 'btc') {
      return this.send();
    }

    if (this.props.wire.currency === 'usd' && !this.props.wire.showCardselector) {
      return this.props.wire.setShowCardselector(true);
    }

    Alert.alert(
      i18n.t('confirmMessage'),
      i18n.t('wire.confirmMessage', {amount: this.props.wire.formatAmount(this.props.wire.amount), name: this.props.wire.owner.username}),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('ok'), onPress: () => this.send() },
      ],
      { cancelable: false }
    );
  }

  /**
   * Call send and go back on success
   */
  async send() {
    const onComplete = this.props.navigation.state.params.onComplete;
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
          { cancelable: false }
        );
      }
    }
  }

  /**
   * Get formated amount of last month sum
   */
  getTextAmount() {
    return this.props.wire.formatAmount(this.props.wire.owner.sums.tokens);
  }

  changeInput = (val) => {
    if (val !== '') {
      val = val.replace(',','.');
      val = val.replace('..','.');
      val = val.replace("/(?<=\w)\.(?=\w+\.)|\G\w+\K\./g", '');
    }
    this.props.wire.setAmount(val);
  }
}

const selectedcolor = '#4690D6';
const color = '#444';
