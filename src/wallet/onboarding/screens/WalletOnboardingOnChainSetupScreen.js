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
      Alert.alert('Heads up!', `
      Ensure you EXPORT and back-up your key before uninstalling
      or wiping the app data, or you will lose your funds.
      ${"\n"}
      Exporting can be done from the Address detail screen.
      `, [
        { text: 'I understand', onPress: () => resolve() }
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
    const error = this.validatePin(pin) ? '' : 'Password must be at least 6 characters, which can be either alphanumeric or symbols';
    this.setState({ pin, err });
  }

  getPin() {
    return this.state.pin;
  }

  setPinConfirmation = pinConfirmation => {
    const error = pinConfirmation == this.state.pin ? '' : 'Password and confirmation should match.';
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
          To create a new wallet address, please enter a keychain password
          that will be used to encrypt your private key onto this device.
        </Text>

        {!!this.state.error && <View>
          <Text style={style.error}>{this.state.error}</Text>
        </View>}

        <View style={[style.cols, style.form]}>
          <TextInput
            style={[style.col, style.colFirst, style.textInput, style.textInputCentered]}
            value={this.getPin()}
            onChangeText={this.setPin}
            placeholder="password"
            secureTextEntry={true}
            maxLength={12}
          />
          <Button
            text="CREATE"
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
          Please confirm once more your keychain password. Once confirmed
          your wallet will be created on this device and attached
          to your account.
        </Text>

        {!!this.state.error && <View>
          <Text style={style.error}>{this.state.error}</Text>
        </View>}

        <View style={[style.cols, style.form]}>
          <TextInput
            style={[style.col, style.colFirst, style.textInput, style.textInputCentered]}
            value={this.getPinConfirmation()}
            onChangeText={this.setPinConfirmation}
            placeholder="confirm password"
            secureTextEntry={true}
            maxLength={12}
          />

          <Button
            text="RETRY"
            onPress={this.retryAction}
            containerStyle={[style.col, style.colLazy, {margin: 0, justifyContent: 'center'}]}
          />

          <Button
            text="CONFIRM"
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
          Your keychain password is already setup, you just need to confirm the
          wallet creation. Once confirmed your wallet will be created on
          this device and attached to your account.
        </Text>

        <View style={[style.cols, style.colsCenter, style.form]}>
          {this.state.alreadyHasPin && <Text
            style={[style.col, style.colFirst, style.primaryLegendUppercase]}
          >
            KEYCHAIN ALREADY SETUP
          </Text>}

          <Button
            text="CREATE"
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
        title="SKIP, I'M NOT INTERESTED"
        color={Colors.darkGreyed}
      />
    );
  }

  render() {
    return (
      <View>
        <Text style={style.h1}>Setup your OnChain address</Text>

        <Text style={style.p}>
          To receive OnChain payments from other channels (eg, from a Wire
          or a Boost), you will need to let us know which address to direct
          these tokens to.
        </Text>

        <Text style={style.p}>
          This address will be listed in your wallet as your Receiver Address
          and can be changed at any time.
        </Text>

        <Text style={style.p}>
          OnChain addresses, and their private keys, are saved locally in an
          encrypted storage space. They will be available to any channel
          that is currently logged in onto this device.
        </Text>

        <View>
          {this.getFormPartial()}
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
