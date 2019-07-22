import React, {
  Component
} from 'react';

import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import keychainService from '../../../common/services/keychain.service';

import TransparentButton from '../../../common/components/TransparentButton';
import Button from '../../../common/components/Button';
import NavNextButton from '../../../common/components/NavNextButton';

import Colors from '../../../styles/Colors';

import stylesheet from '../../../onboarding/stylesheet';
import BlockchainWalletService from '../../../blockchain/wallet/BlockchainWalletService';
import BlockchainApiService from '../../../blockchain/BlockchainApiService';
import i18n from '../../../common/services/i18n.service';

export default class WalletOnboardingOnChainSetupScreen extends Component {
  state = {
    inProgress: false,
    pin: '',
    pinConfirmation: '',
    confirmingPin: false,
    alreadyHasPin: false,
    error: ''
  }

  async componentWillMount() {
    if (await keychainService.hasSecret('wallet')) {
      this.setState({ alreadyHasPin: true, confirmingPin: true });
    }
  }

  componentDidMount() {
    this.props.onSetNavNext(this.getNextButton());
  }

  create() {
    if (!this.canCreate()) {
      return;
    }

    this.setState({ confirmingPin: true });
  }

  retry() {
    this.setState({ confirmingPin: false, pin: '', pinConfirmation: '' });
  }

  async confirm() {
    if (this.state.inProgress || !this.canConfirm()) {
      return;
    }

    this.setState({ inProgress: true });

    try {
      if (!(await keychainService.hasSecret('wallet'))) {
        await keychainService.setSecretIfEmpty('wallet', this.state.pin);
      }

      const address = await BlockchainWalletService.create();

      await BlockchainApiService.setWallet(address);

      await this.showEphemeralWarning();

      this.props.onNext({ address });
    } catch (e) {
      error = (e && e.message) || 'Unknown error';
      this.setState({ error });
      console.error(e);
    } finally {
      this.setState({ inProgress: false });
    }
  }

  showEphemeralWarning() {
    return new Promise(resolve => {
      Alert.alert(i18n.t('headsUp'), i18n.t('onboarding.ensureYouExportKey'), [
        { text: i18n.t('iUnderstand'), onPress: () => resolve() }
      ], { cancelable: false });
    });
  }

  canCreate() {
    return this.validatePin(this.state.pin);
  }

  validatePin(pin) {
    return pin && /^[0-9a-z\-!$%^@&*()_#+|~=`{}\[\]:";'<>?,.\/]{6,}$/.test(pin);
  }

  matchPins() {
    return this.state.pin === this.state.pinConfirmation;
  }

  canConfirm() {
    return this.state.alreadyHasPin ||
      (this.validatePin(this.state.pin) && this.matchPins());
  }

  setPin = pin => {
    const error = this.validatePin(pin) ? '' : i18n.t('onboarding.passwordInvalid');
    this.setState({ pin, error });
  }

  getPin() {
    return this.state.pin;
  }

  setPinConfirmation = pinConfirmation => {
    const error = pinConfirmation == this.state.pin ? '' : i18n.t('auth.confirmPasswordError');
    this.setState({ pinConfirmation, error });
  }

  getPinConfirmation() {
    return this.state.pinConfirmation;
  }

  createAction = () => this.create();
  retryAction = () => this.retry();
  confirmAction = () => this.confirm();

  getPinFormPartial() {
    return (
      <View>
        <Text style={style.p}>
          {i18n.t('onboarding.6digitDescription')}
        </Text>

        {!!this.state.error && <View>
          <Text style={style.error}>{this.state.error}</Text>
        </View>}

        <View style={[style.cols, style.form]}>
          <TextInput
            style={[style.col, style.colFirst, style.textInput, style.textInputCentered]}
            value={this.getPin()}
            onChangeText={this.setPin}
            placeholder={i18n.t('auth.password')}
            secureTextEntry={true}
            maxLength={12}
          />
          <Button
            text={i18n.t('create').toUpperCase()}
            onPress={this.createAction}
            containerStyle={[style.col, style.colLazy, {margin: 0, justifyContent: 'center'}]}
            disabled={!this.canCreate()}
          />
        </View>
      </View>
    );
  }

  getConfirmPinFormPartial() {
    return (
      <View>
        <Text style={style.p}>
          {i18n.t('onboarding.6digitConfirm')}
        </Text>

        {!!this.state.error && <View>
          <Text style={style.error}>{this.state.error}</Text>
        </View>}

        <View style={[style.cols, style.form]}>
          <TextInput
            style={[style.col, style.colFirst, style.textInput, style.textInputCentered]}
            value={this.getPinConfirmation()}
            onChangeText={this.setPinConfirmation}
            placeholder={i18n.t('auth.confirmpassword')}
            secureTextEntry={true}
            maxLength={12}
          />

          <Button
            text={i18n.t('retry').toUpperCase()}
            onPress={this.retryAction}
            containerStyle={[style.col, style.colLazy, {margin: 0, justifyContent: 'center'}]}
          />

          <Button
            text={i18n.t('confirm').toUpperCase()}
            onPress={this.confirmAction}
            loading={this.state.inProgress}
            containerStyle={[style.col, style.colLazy, {margin: 0, justifyContent: 'center'}]}
            disabled={!this.canConfirm()}
          />
        </View>
      </View>
    );
  }

  getAlreadyHasPinFormPartial() {


    return (
      <View>
        <Text style={style.p}>
          {i18n.t('onboarding.6digitAlreadySetup')}
        </Text>

        <View style={[style.cols, style.colsCenter, style.form]}>
          {this.state.alreadyHasPin && <Text
            style={[style.col, style.colFirst, style.primaryLegendUppercase]}
          >
            {i18n.t('onboarding.pinAlreadySetup')}
          </Text>}

          <Button
            text={i18n.t('create').toUpperCase()}
            onPress={this.confirmAction}
            containerStyle={[style.col, style.colLazy, {margin: 0, justifyContent: 'center'}]}
            disabled={!this.canConfirm()}
          />
        </View>
      </View>
    );
  }

  getFormPartial() {
    if (!this.state.confirmingPin)
      return this.getPinFormPartial();
    else
      return this.state.alreadyHasPin ? this.getAlreadyHasPinFormPartial() : this.getConfirmPinFormPartial();
  }

  //

  getNextButton = () => {
    return (
      <NavNextButton
        onPress={this.props.onNext}
        title={i18n.t('onboarding.skip')}
        color={Colors.darkGreyed}
      />
    );
  }

  render() {
    return (
      <View>
        <Text style={style.h1}>{i18n.t('onboarding.setupOnchianAddress')}</Text>

        <Text style={style.p}>
          {i18n.t('onboarding.onchainDescription1')}
        </Text>

        <Text style={style.p}>
          {i18n.t('onboarding.onchainDescription2')}
        </Text>

        <Text style={style.p}>
          {i18n.t('onboarding.onchainDescription3')}
        </Text>

        <View>
          {this.getFormPartial()}
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
